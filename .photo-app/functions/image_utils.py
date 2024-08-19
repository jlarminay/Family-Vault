from PIL import Image
import os

def resize_and_pad_image(image_path, output_path, screen_width, screen_height):
    with Image.open(image_path) as img:
        img_ratio = img.width / img.height
        screen_ratio = screen_width / screen_height

        if img_ratio > screen_ratio:
            new_width = screen_width
            new_height = round(new_width / img_ratio)
        else:
            new_height = screen_height
            new_width = round(new_height * img_ratio)

        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        new_img = Image.new("RGB", (screen_width, screen_height))
        paste_position = ((screen_width - new_width) // 2, (screen_height - new_height) // 2)
        new_img.paste(img, paste_position)
        new_img.save(output_path)

def display_image(image_path):
    os.system(f'fbi -T 1 -d /dev/fb0 -noverbose -a {image_path} > /dev/null 2>&1')
