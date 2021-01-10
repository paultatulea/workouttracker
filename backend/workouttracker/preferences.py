import json



# Default values for available settings
DEFAULT_SETTINGS = {
    # Controls the mass units used in the application
    'massUnit': 1,
}

available_settings = DEFAULT_SETTINGS.keys()
default_settings_json_string = json.dumps(DEFAULT_SETTINGS)


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
