import json
import yaml

DEFAULT_USER_SETTINGS_PATH = 'defaultUserSettings.yml'

with open(DEFAULT_USER_SETTINGS_PATH, 'r') as f:
    default_user_settings = yaml.safe_load(f)

available_settings = default_user_settings.keys()
default_settings_json_string = json.dumps(default_user_settings)


def verify_settings_integrity(settings):
    """ Verify that the settings dict or json has all the correct settings.
    Return True if integrity of settings object is good, else return False.
    """
    # Convert json to python dict
    if not isinstance(settings, dict):
        settings = json.loads(settings)
    # Check keys are the same as default settings
    if settings.keys() != available_settings:
        return False
    return True
