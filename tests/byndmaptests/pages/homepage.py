import time

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from byndmaptests.pages.basepage import BasePage


class HomePageLocators(object):
    LOGIN = (By.CSS_SELECTOR, 'login alt mat-raised-button')
    LOGO = (By.CSS_SELECTOR, '.header-logo')
    RANDOM_LOCATION_BTN = (By.CSS_SELECTOR, '.header-logo')
    TOOLBAR = (By.CSS_SELECTOR, '.mat-toolbar-row >span.logo')
    HEADER_TITLE = (By.CLASS_NAME, 'logo')
    #SEARCH
    SEARCH_FIELD = (By.CSS_SELECTOR, 'input#md-input-1')
    SORT_POST_MENU = (By.CSS_SELECTOR, 'md-select')
    #search-sort mat-select ng-tns-c10-2 mat-primary ng-pristine ng-valid ng-touched
    ADD_LOCATION_FIELDS = (By.CSS_SELECTOR, '.mat-input-wrapper')
    LOCATION_TITLE = (By.CSS_SELECTOR, 'h3:nth-child(1)')
    #POSTS
    LIST_CONTAINER = (By.CLASS_NAME, 'full-list')
    POSTS = (By.CSS_SELECTOR, '#md-card.form-container.mat-card')

    #Individual posts
    CHOSEN_POST = (By.CSS_SELECTOR, '.mat-card')

    #Search
    ENTER_NEW_LOCATION = (By.CSS_SELECTOR, 'input#autocomplete')


class HomePage(BasePage):
    url = '/'
    title = 'Beyond Map'

    # if applicable, needs a test in test_home
    def get_login(self):
        return self.driver.find_element(*HomePageLocators.LOGIN)

    def is_title_matches(self):
        element = self.driver.find_element(*HomePageLocators.HEADER_TITLE)
        return self.title == element.text

    # passed
    def get_logo(self):
        return self.driver.find_element(*HomePageLocators.LOGO)

    # passed
    def get_random_loc_btn(self):
        return self.driver.find_element(*HomePageLocators.RANDOM_LOCATION_BTN)

    # passed
    def get_toolbar(self):
        return self.driver.find_element(*HomePageLocators.TOOLBAR)

    def get_header(self):
        return self.driver.find_element(*HomePageLocators.HEADER_TITLE)

    def get_search(self):
        return self.driver.find_element(*HomePageLocators.SEARCH_FIELD)

    def search_for_term(self, term):
        element = self.driver.find_element(*HomePageLocators.SEARCH_FIELD)
        element.clear()
        element.send_keys(term)
        element.send_keys(Keys.ENTER)
        time.sleep(1)

    def search_for_newterm(self, term):
        element = self.driver.find_element(*HomePageLocators.SEARCH_FIELD)
        element.clear()
        element.send_keys(term)
        element.send_keys(Keys.ENTER)
        time.sleep(2)
        # return self.driver.find_elements(*HomePageLocators.SEARCH_FEILD)

    def get_sort_menu(self):
        return self.driver.find_element(*HomePageLocators.SORT_POST_MENU)

    def get_location_field(self):
        return self.driver.find_element(*HomePageLocators.ADD_LOCATION_FIELDS)

    def get_location_title(self, param):
        return self.driver.find_element(*HomePageLocators.LOCATION_TITLE)

    def get_list_container(self):
        return self.driver.find_elements(*HomePageLocators.LIST_CONTAINER)

    def get_list_of_post(self):
        return self.driver.find_elements(*HomePageLocators.POSTS)

    # Get individual card
    def get_card(self):
        return self.driver.find_element(*HomePageLocators.CHOSEN_POST)


    # def get_card_loc(self):
    #     return self.driver.find_element(*HomePageLocators.POST_LOC)

    def get_location_title(self, param):
        pass

