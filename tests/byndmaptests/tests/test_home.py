
import unittest

from byndmaptests.browser import get_browser_driver, BASE_URL
from byndmaptests.pages.homepage import HomePage


class HomepageTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = get_browser_driver()
        cls.page = HomePage(cls.driver, BASE_URL)
        cls.page.navigate()

    def test_no_404_errors(self):
        logs = self.page.get_error_logs()
        for l in logs:
            self.assertNotIn('status of 4', l['message'], msg="4xx errors detected")

    def test_get_logo(self):
        assert self.page.get_logo(), "Logo is missing"

    def test_get_rndm_loc(self):
        assert self.page.get_random_loc_btn(), "Random button is missing"

    def test_get_toolbar(self):
        title = self.page.get_toolbar()
        assert "Beyond Adventure Log", title

    def test_get_searchbar(self):
        assert self.page.get_search(), "Searchbar is missing"

    def test_search_term(self):
        # want to assert that the term search matches the term entered
        location_name = self.page.search_for_term('New York')
        assert "New York", location_name

    def test_search_term2(self):
        location_name = self.page.search_for_term('London')
        assert "London", location_name

  # assert len(results) > 0, "No search results found"
        #
        # # Select card
        # location = results[0]
        # homepage = HomePage(self.driver, BASE_URL)
        # homepage.url = location.get_attribute('href')
        # homepage.title = location.text
        # homepage.navigate()
        #
        # assert len(homepage.get_page_title()) > 10, "Search result does not exist"

    def test_get_sort_menu(self):
        list = self.page.get_sort_menu(), "Sort menu is missing"
        assert len(list) < 5, "List items are missing"

    def test_get_loc_field(self):
        assert self.page.get_location_field(), "location field is missing"

    def test_get_header_title(self):
        assert self.page.get_header(), "Location header is missing"

    def test_get_list_container(self):
        items = self.page.get_list_container()
        assert len(items) >= 1, "Container is missing- No list"

    def test_get_location_title(self):
        loc_title_field = self.page.get_location_title('Add a location')
        assert "Add a location", loc_title_field

    def test_get_listitems(self):
        post = self.page.get_list_of_post()
        assert post >= 1, "Missing posts"
        print len(post)


    @classmethod
    def tearDownClass(cls):
        cls.driver.close()
