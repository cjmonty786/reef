import { ReefPage } from './app.po';

describe('reef App', function() {
  let page: ReefPage;

  beforeEach(() => {
    page = new ReefPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
