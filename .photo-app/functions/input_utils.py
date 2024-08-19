import evdev
import time

# Constants for tap detection
DEBOUNCE_TIME = 0.05  # debounce time to avoid multiple registrations of the same tap
TAP_THRESHOLD = 0.5  # seconds between taps to consider them as part of the same sequence
DEVICE_PATH = '/dev/input/event0'

def get_touch_events():
    # Open the device
    device = evdev.InputDevice(DEVICE_PATH)
    touch_events = []
    try:
        for event in device.read_loop():
            if event.type == evdev.ecodes.EV_ABS:
                touch_events.append(event)
            if event.type == evdev.ecodes.EV_SYN:
                # Process touch events after a sync event
                yield touch_events
                touch_events = []
    except KeyboardInterrupt:
        pass

def process_touch_events():
    touch_events = get_touch_events(DEVICE_PATH)
    last_tap_time = 0
    
    for events in touch_events:
        current_time = time.time()

        # Check if the event should be processed
        if current_time - last_tap_time > DEBOUNCE_TIME:
            # Single tap detection
            print("Single tap detected")
            # Move to the next image
            last_tap_time = current_time
