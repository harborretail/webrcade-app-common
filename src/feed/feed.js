import { remapUrl } from '../app/';
import { AppRegistry } from '../apps/';
import { FeedBase } from './feedbase.js'
import { cloneObject } from '../util';

class Feed extends FeedBase {
  constructor(feed, minLength, filterCategories = true) {
    super(minLength);
    // Non-destructive
    feed = cloneObject(feed);
    this.filterCategories = filterCategories;
    this._parseFeed(feed);
    this.originalFeed = feed;
  }

  _parseFeed(feed) {
    const reg = AppRegistry.instance;

    // Ensure title
    const title = feed.title;
    if (title === undefined) {
      throw new Error("Missing title");
    }

    if (feed.background) feed.background = remapUrl(feed.background);
    if (feed.thumbnail) feed.thumbnail = remapUrl(feed.thumbnail);
    if (!feed.props) feed.props = {}

    // Ensure categories are available
    let categories = feed.categories;

    if (categories === undefined) {
      throw new Error("Missing categories");
    }

    // Filter categories
    categories = categories.filter(c => {
      if (c.title === undefined) {
        this._logInvalidObject('Category missing title', c);
        return false;
      } else if (c.items === undefined || c.items.length === 0) {
        if (!this.filterCategories) {
          c.items = [];
        } else {
          this._logInvalidObject('Category missing items', c);
          return false;
        }
      }

      if (c.background) c.background = remapUrl(c.background);
      if (c.thumbnail) c.thumbnail = remapUrl(c.thumbnail);

      return true;
    });

    // Filter and expand category items
    categories.forEach(category => {
      category.items = this._expandItems(
        category.items.filter(a => {
          try {
            reg.validate(a);
            if (a.background) a.background = remapUrl(a.background);
            if (a.thumbnail) a.thumbnail = remapUrl(a.thumbnail);
          } catch (e) {
            this._logInvalidObject('Item is invalid: ' + e, a);
            return false;
          }
          return true;
        }).sort(this.TITLE_SORT)
      );
    });

    this.uniqueCategoryCount = categories.length;

    // Expand valid categories
    categories = this._expandItems(categories.filter(c => {
      return c.items.length > 0 || !this.filterCategories;
    }));
    if (categories.length === 0 && this.filterCategories) {
      throw new Error("No valid categories found.");
    }
    this.categories = categories;
  }

  getTitle() {
    return this.originalFeed.title;
  }

  getProps() {
    return this.originalFeed.props ? this.originalFeed.props : {}
  };

  getCategories() { return this.categories; }

  getUniqueCategoryCount() { return this.uniqueCategoryCount; }

  getApps(categoryId) {
    const category = this.categories.filter(c => c.id === categoryId);
    if (category.length > 0) {
      return category[0].items;
    }
    throw new Error(`Unable to find category with id: ${categoryId}`);
  }

  findCategoryByTitle(title) {
    if (!title) return null;
    for (let i = 0; i < this.categories.length; i++) {
      const cat = this.categories[i];
      if (cat.title === title) {
        return cat;
      }
    }
    return null;
  }

  getClonedFeed() {
    // Clone the original feed
    const feed = cloneObject(this.originalFeed);
    // Clone the updated categories (and items)
    feed.categories =
      this.categories ? cloneObject(this.categories) : [];
    return feed;
  }
}

export { Feed }
