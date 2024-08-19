import time
import threading
import evdev
from dotenv import load_dotenv
from functions.image_utils import resize_and_pad_image, display_image

# Load environment variables from .env file
load_dotenv()

# Configuration
IMAGE_DISPLAY_TIME = int(os.getenv('IMAGE_DISPLAY_TIME', 5))
SCREEN_WIDTH = int(os.getenv('SCREEN_WIDTH', 1024))
SCREEN_HEIGHT = int(os.getenv('SCREEN_HEIGHT', 600))
TOUCHSCREEN_DEVICE = os.getenv('TOUCHSCREEN_DEVICE', '/dev/input/event0')
NEXT_IMAGE_PATH = "next_image.jpg"

images = [
    'images/bath.jpg',
    'images/cat.png',
    'images/demo.png',
    'images/forest.webp',
    'images/rusty.jpg',
    'images/tree.jpg'
]

def prepare_next_image(next_image_path):
    print(f"Preparing next image: {next_image_path}")
    # Resize and pad the image
    resize_and_pad_image(next_image_path, NEXT_IMAGE_PATH, SCREEN_WIDTH, SCREEN_HEIGHT)

def main():
    current_image_index = 0

    # Prepare the first image
    prepare_next_image(images[current_image_index])

    # Open the touchscreen device
    touchscreen = evdev.InputDevice(TOUCHSCREEN_DEVICE)

    while True:        
        # Display the image
        display_image(NEXT_IMAGE_PATH)

        # Start a thread to prepare the next image while displaying the current one
        current_image_index = (current_image_index + 1) % len(images)
        next_image_path = images[current_image_index]
        preparation_thread = threading.Thread(target=prepare_next_image, args=(next_image_path,))
        preparation_thread.start()

        time.sleep(IMAGE_DISPLAY_TIME)

if __name__ == "__main__":
    main()
