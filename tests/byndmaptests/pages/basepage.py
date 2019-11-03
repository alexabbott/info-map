import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains


class BasePage(object):
    url = ''

    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def click_element(self, *locator):
        self.driver.find_element(*locator).click()

    def get_page_title(self):
        return self.driver.title

    def navigate(self):
        if self.url.startswith('/'):
            return self.driver.get(self.base_url + self.url)
        return self.driver.get(self.url)

    def is_title_matches(self):
        return self.title == self.driver.title

    def scroll_to_element(self, element):
        actions = ActionChains(self.driver)
        actions.move_to_element(element)
        actions.perform()

    def scroll_to_bottom(self):
        # Scroll to the bottom of the page
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    def get_scroll_position(self):
        return self.driver.execute_script("return window.scrollY;")

    def get_error_logs(self):
        return self.driver.get_log("browser")
