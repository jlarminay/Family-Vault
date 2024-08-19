from PIL import Image, ImageDraw, ImageFont
from datetime import datetime

TIME_FORMAT = '%H:%M:%S'
TIMER_HEIGHT = 10  # Height of the timer bar in pixels

def update_time_image(image_path, output_path, screen_width, screen_height, elapsed_percentage):
    with Image.open(image_path) as base_img:
        # Initialize the font and overlay image
        font = ImageFont.load_default()
        overlay_img = base_img.copy()
        draw = ImageDraw.Draw(overlay_img)
        now = datetime.now().strftime(TIME_FORMAT)
        
        # Calculate the width and height of the text
        # text_bbox = draw.textbbox((0, 0), now, font=font)
        # text_width, text_height = text_bbox[2] - text_bbox[0], text_bbox[3] - text_bbox[1]
        
        # # Calculate the position of the text
        # text_x = screen_width - text_width - 10
        # text_y = 10
        # draw.text((text_x, text_y), now, font=font, fill='white')

        # Calculate the width of the timer bar
        bar_width = int(screen_width * elapsed_percentage)
        
        # Draw the timer bar
        bar = Image.new('RGBA', (screen_width, TIMER_HEIGHT), color=(0, 0, 0, 0))  # Transparent background
        bar_draw = ImageDraw.Draw(bar)
        bar_draw.rectangle([0, 0, bar_width, TIMER_HEIGHT], fill='red')
        
        # Overlay the timer bar on the image
        overlay_img = overlay_img.convert('RGBA')
        overlay_img.paste(bar, (0, screen_height - TIMER_HEIGHT), bar)
        overlay_img.save(output_path)
