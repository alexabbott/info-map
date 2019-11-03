import os

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary


DRIVER = os.getenv('DRIVER', 'chrome')
BASE_URL = os.getenv('BASE_URL', 'https://bynd-map.firebaseapp.com/')


def _run_google_authentication(driver, url):
    driver.get(url)
    wait = WebDriverWait(driver, 120)
    element = wait.until(EC.title_contains('Beyond Map'))


def get_browser_driver():
    return globals()["get_%s_driver" % DRIVER]()


def get_chrome_driver():
    desired_capabilities = webdriver.DesiredCapabilities.CHROME
    desired_capabilities['loggingPrefs'] = {'browser': 'ALL'}

    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--user-data-dir=/tmp/browserdata/chrome")

    desired_capabilities.update(chrome_options.to_capabilities())

    # browser = webdriver.Remote(
    #     desired_capabilities=desired_capabilities,
    #     command_executor="http://localhost:14444/wd/hub"
    # )

    browser = webdriver.Chrome(executable_path='chromedriver', desired_capabilities=desired_capabilities)

    # Desktop size
    browser.set_window_position(0, 0)
    browser.set_window_size(1366, 768)

    # Run authentication
    _run_google_authentication(browser, BASE_URL)

    return browser


def get_chrome_mobile_driver():
    desired_capabilities = webdriver.DesiredCapabilities.CHROME
    desired_capabilities['loggingPrefs'] = {'browser': 'ALL'}

    mobile_emulation = {"deviceName": "Google Nexus 5"}
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_experimental_option("mobileEmulation", mobile_emulation)
    chrome_options.add_argument("--user-data-dir=/tmp/browserdata/chrome")

    desired_capabilities.update(chrome_options.to_capabilities())

    # browser = webdriver.Remote(
    #     desired_capabilities=desired_capabilities,
    #     command_executor="http://localhost:14444/wd/hub"
    # )

    browser = webdriver.Chrome(executable_path='chromedriver', desired_capabilities=desired_capabilities)

    # Run authentication
    _run_google_authentication(browser, BASE_URL)

    return browser


def get_firefox_driver():
    desired_capabilities = webdriver.DesiredCapabilities.FIREFOX
    desired_capabilities['loggingPrefs'] = {'browser': 'ALL'}

    desired_capabilities['marionette'] = False

    firefox_path = '/Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin'
    firefox_log_file = open('/tmp/firefox.log', 'w')

    desired_capabilities['binary'] = FirefoxBinary(firefox_path=firefox_path, log_file=firefox_log_file)

    # firefox_options = webdriver.firefox.options.Options();
    # desired_capabilities.update(firefox_options.to_capabilities())

    # browser = webdriver.Remote(
    #     desired_capabilities=desired_capabilities,
    #     command_executor="http://localhost:24444/wd/hub"
    # )

    profile = webdriver.FirefoxProfile(profile_directory="/tmp/browserdata/firefox")

    browser = webdriver.Firefox(capabilities=desired_capabilities, firefox_profile=profile)
    #browser = webdriver.Firefox()
    # Desktop size
    browser.set_window_position(0, 0)
    browser.set_window_size(1366, 768)

    # Run authentication
    _run_google_authentication(browser, BASE_URL)

    return browser


def get_safari_driver():
    desired_capabilities = webdriver.DesiredCapabilities.SAFARI
    desired_capabilities['loggingPrefs'] = {'browser': 'ALL'}

    browser = webdriver.Safari()

    # Desktop size
    browser.set_window_position(0, 0)
    browser.set_window_size(1366, 768)

    # Run authentication
    _run_google_authentication(browser, BASE_URL)

    return browser


