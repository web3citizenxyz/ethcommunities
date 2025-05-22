# This is the ETH Community

# Have an Ethereum Focused Community? Submit it

To add your community, please follow these steps:

1.  **Fork the repository:** Start by forking this repository to your own GitHub account.
2.  **Clone your fork:** Clone your forked repository to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/ETHCommunities.git
    ```
3.  **Navigate to the project directory:**
    ```bash
    cd ETHCommunities
    ```
4.  **Open `communities.json`:** Locate and open the `communities.json` file in your preferred code editor.
5.  **Add your community:** Add a new JSON object to the existing array. Each community object should include name, country where it is based and city. Additionally you can include your website or twitter handle.

Follow this structure:

    ```json
    {
      "name": "Your Community Name",
      "url": "https://yourcommunityurl.com",
      "website": "https://website.com/ (Optional; or include twitter, github or telegram link)",
    }
    ```
    **Important:**
    *   Ensure your entry is added correctly within the JSON array (i.e., add a comma after the preceding entry if yours is not the last one).
    *   Validate your JSON before committing. You can use an online JSON validator.
6.  **Commit your changes:**
    ```bash
    git add communities.json
    git commit -m "Add [Your Community Name] to communities list"
    ```
7.  **Push to your fork:**
    ```bash
    git push origin main
    ```
8.  **Create a Pull Request:** Go to the original ETHCommunities repository on GitHub and create a new Pull Request from your forked repository. Provide a clear title and description for your PR.

We will review your submission and merge it if everything looks good!!
