import { Likert2Page } from './app.po';

describe('likert2 App', () => {
  let page: Likert2Page;

  beforeEach(() => {
    page = new Likert2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
