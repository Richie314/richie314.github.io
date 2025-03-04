// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-repos",
          title: "Repos",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "A non representative list of some side project",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "projects-calculate-𝜋-in-the-browser",
          title: 'Calculate 𝜋 in the browser',
          description: "Play with different methods of approximation of 𝜋",
          section: "Projects",handler: () => {
              window.location.href = "/projects/pi/";
            },},{id: "projects-sorting-algorithms-simulation",
          title: 'Sorting Algorithms simulation',
          description: "Play with many sorting algorithms rendered in canvas and understand how they work. Each one is accompanied with a simple c++ implementation",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sorting/";
            },},{id: "projects-star-wars-intro-maker",
          title: 'Star Wars intro maker',
          description: "Star Wars intro simulation via javascript and css",
          section: "Projects",handler: () => {
              window.location.href = "/projects/starwars/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%72%69%63%63%61%72%64%6F@%63%69%75%63%63%69.%64%65%76", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Richie314", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/riccardo-ciucci-03bba8309", "_blank");
        },
      },{
        id: 'social-telegram',
        title: 'telegram',
        section: 'Socials',
        handler: () => {
          window.open("https://telegram.me/richie314", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
