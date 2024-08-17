// MARK: SimpleHeat
/*
 (c) 2014, Vladimir Agafonkin
 simpleheat, a tiny JavaScript library for drawing heatmaps with Canvas
 https://github.com/mourner/simpleheat
*/
!(function () {
  'use strict';

  function Heatmap(canvas) {
    if (!(this instanceof Heatmap)) {
      return new Heatmap(canvas);
    }

    // Initialize the heatmap
    this._canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
    this._ctx = this._canvas.getContext('2d');
    this._width = this._canvas.width;
    this._height = this._canvas.height;
    this._max = 1;

    this.clear();
  }

  Heatmap.prototype = {
    defaultRadius: 25,
    defaultGradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1: 'red' },

    data: function (data) {
      this._data = data;
      return this;
    },

    max: function (max) {
      this._max = max;
      return this;
    },

    add: function (point) {
      this._data.push(point);
      return this;
    },

    clear: function () {
      this._data = [];
      return this;
    },

    radius: function (radius, blur) {
      blur = blur || 15;

      const circle = document.createElement('canvas');
      const ctx = circle.getContext('2d');
      const r = radius + blur;

      circle.width = circle.height = 2 * r;
      ctx.shadowOffsetX = ctx.shadowOffsetY = 200;
      ctx.shadowBlur = blur;
      ctx.shadowColor = 'black';

      ctx.beginPath();
      ctx.arc(r - 200, r - 200, radius, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.fill();

      this._circle = circle;
      this._r = r;

      return this;
    },

    gradient: function (colors) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 256);

      canvas.width = 1;
      canvas.height = 256;

      for (const stop in colors) {
        gradient.addColorStop(stop, colors[stop]);
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1, 256);

      this._grad = ctx.getImageData(0, 0, 1, 256).data;

      return this;
    },

    draw: function (minOpacity) {
      if (!this._circle) this.radius(this.defaultRadius);
      if (!this._grad) this.gradient(this.defaultGradient);

      const ctx = this._ctx;
      ctx.clearRect(0, 0, this._width, this._height);

      for (const point of this._data) {
        ctx.globalAlpha = Math.max(point[2] / this._max, minOpacity || 0.05);
        ctx.drawImage(this._circle, point[0] - this._r, point[1] - this._r);
      }

      const imageData = ctx.getImageData(0, 0, this._width, this._height);
      this._colorize(imageData.data, this._grad);
      ctx.putImageData(imageData, 0, 0);

      return this;
    },

    _colorize: function (data, gradient) {
      for (let i = 3; i < data.length; i += 4) {
        const alpha = 4 * data[i];
        if (alpha) {
          data[i - 3] = gradient[alpha];
          data[i - 2] = gradient[alpha + 1];
          data[i - 1] = gradient[alpha + 2];
        }
      }
    },
  };

  window.simpleheat = Heatmap;
})();

// MARK: Leaflet.heat
/*
 (c) 2014, Vladimir Agafonkin
 Leaflet.heat, a tiny and fast heatmap plugin for Leaflet.
 https://github.com/Leaflet/Leaflet.heat
*/
L.HeatLayer = (L.Layer ? L.Layer : L.Class).extend({
  initialize: function (latlngs, options) {
    this._latlngs = latlngs;
    L.setOptions(this, options);
  },

  setLatLngs: function (latlngs) {
    this._latlngs = latlngs;
    return this.redraw();
  },

  addLatLng: function (latlng) {
    this._latlngs.push(latlng);
    return this.redraw();
  },

  setOptions: function (options) {
    L.setOptions(this, options);
    if (this._heat) this._updateOptions();
    return this.redraw();
  },

  redraw: function () {
    if (!this._heat || this._frame || this._map._animating) {
      this._frame = L.Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  },

  onAdd: function (map) {
    this._map = map;
    if (!this._canvas) this._initCanvas();
    map._panes.overlayPane.appendChild(this._canvas);
    map.on('moveend', this._reset, this);
    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }
    this._reset();
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this._canvas);
    map.off('moveend', this._reset, this);
    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },

  addTo: function (map) {
    map.addLayer(this);
    return this;
  },

  _initCanvas: function () {
    const canvas = (this._canvas = L.DomUtil.create(
      'canvas',
      'leaflet-heatmap-layer leaflet-layer',
    ));
    const transformOrigin = L.DomUtil.testProp([
      'transformOrigin',
      'WebkitTransformOrigin',
      'msTransformOrigin',
    ]);
    canvas.style[transformOrigin] = '50% 50%';

    const size = this._map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;

    const hasZoomAnimation = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (hasZoomAnimation ? 'animated' : 'hide'));

    this._heat = simpleheat(canvas);
    this._updateOptions();
  },

  _updateOptions: function () {
    this._heat.radius(this.options.radius || this._heat.defaultRadius, this.options.blur);
    if (this.options.gradient) this._heat.gradient(this.options.gradient);
    if (this.options.max) this._heat.max(this.options.max);
  },

  _reset: function () {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);

    const size = this._map.getSize();
    if (this._heat._width !== size.x) {
      this._canvas.width = this._heat._width = size.x;
    }
    if (this._heat._height !== size.y) {
      this._canvas.height = this._heat._height = size.y;
    }

    this._redraw();
  },

  _redraw: function () {
    const data = [];
    const radius = this._heat._r;
    const mapSize = this._map.getSize();
    const bounds = new L.Bounds(L.point([-radius, -radius]), mapSize.add([radius, radius]));
    const max = this.options.max !== undefined ? this.options.max : 1;
    const maxZoom =
      this.options.maxZoom !== undefined ? this.options.maxZoom : this._map.getMaxZoom();
    const scale = 1 / Math.pow(2, Math.max(0, Math.min(maxZoom - this._map.getZoom(), 12)));
    const halfRadius = radius / 2;
    const grid = [];
    const mapPanePos = this._map._getMapPanePos();
    const xOffset = mapPanePos.x % halfRadius;
    const yOffset = mapPanePos.y % halfRadius;

    for (let i = 0; i < this._latlngs.length; i++) {
      const point = this._map.latLngToContainerPoint(this._latlngs[i]);
      if (bounds.contains(point)) {
        const gridX = Math.floor((point.x - xOffset) / halfRadius) + 2;
        const gridY = Math.floor((point.y - yOffset) / halfRadius) + 2;
        // const value =
        //   this._latlngs[i].alt !== undefined
        //     ? this._latlngs[i].alt
        //     : this._latlngs[i][2] !== undefined
        //       ? +this._latlngs[i][2]
        //       : 1;
        // const weight = value * scale;
        const weight = this._latlngs[i][2];

        if (grid[gridY]) {
          const cell = grid[gridY][gridX];
          if (cell) {
            cell[0] = (cell[0] * cell[2] + point.x * weight) / (cell[2] + weight);
            cell[1] = (cell[1] * cell[2] + point.y * weight) / (cell[2] + weight);
            cell[2] += weight;
          } else {
            grid[gridY][gridX] = [point.x, point.y, weight];
          }
        } else {
          grid[gridY] = [];
          grid[gridY][gridX] = [point.x, point.y, weight];
        }
      }
    }

    for (let y = 0; y < grid.length; y++) {
      if (grid[y]) {
        for (let x = 0; x < grid[y].length; x++) {
          const cell = grid[y][x];
          if (cell) {
            data.push([Math.round(cell[0]), Math.round(cell[1]), Math.min(cell[2], max)]);
          }
        }
      }
    }

    this._heat.data(data).draw(this.options.minOpacity);
    this._frame = null;
  },

  _animateZoom: function (event) {
    const scale = this._map.getZoomScale(event.zoom);
    const offset = this._map
      ._getCenterOffset(event.center)
      ._multiplyBy(-scale)
      .subtract(this._map._getMapPanePos());

    if (L.DomUtil.setTransform) {
      L.DomUtil.setTransform(this._canvas, offset, scale);
    } else {
      this._canvas.style[L.DomUtil.TRANSFORM] =
        L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  },
});

L.heatLayer = function (latlngs, options) {
  return new L.HeatLayer(latlngs, options);
};
