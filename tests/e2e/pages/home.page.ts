class HomePage {
    /**
     * Create your accessors to html elements here. Example:
     * public get div() { return $(".widget-name div"); }
     */

    public open(): void {
        //@ts-ignore
        browser.url("/");
    }
}
const homepage = new HomePage();
export default homepage;
