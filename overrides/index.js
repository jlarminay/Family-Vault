import shell from 'shelljs';

// local -> target
shell.cp('-f', './overrides/fluent-ffmpeg/index.js', './node_modules/fluent-ffmpeg/index.js');
shell.cp(
  '-f',
  './overrides/fluent-ffmpeg/fluent-ffmpeg.js',
  './node_modules/fluent-ffmpeg/lib/fluent-ffmpeg.js',
);
