import os
from PIL import Image
from config import SCREEN_WIDTH, SCREEN_HEIGHT, NEXT_IMAGE_PATH

def resize_and_pad_image(image_path, output_path):
    """Resize and pad image to fit screen dimensions"""
    with Image.open(image_path) as img:
        img_ratio = img.width / img.height
        screen_ratio = SCREEN_WIDTH / SCREEN_HEIGHT

        if img_ratio > screen_ratio:
            new_width = SCREEN_WIDTH
            new_height = round(new_width / img_ratio)
        else:
            new_height = SCREEN_HEIGHT
            new_width = round(new_height * img_ratio)

        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        new_img = Image.new("RGB", (SCREEN_WIDTH, SCREEN_HEIGHT))
        paste_position = ((SCREEN_WIDTH - new_width) // 2, (SCREEN_HEIGHT - new_height) // 2)
        new_img.paste(img, paste_position)
        new_img.save(output_path)

def display_image(image_path):
    """Display image on the screen"""
    os.system(f'fbi -T 1 -d /dev/fb0 -noverbose -a {image_path} > /dev/null 2>&1')
