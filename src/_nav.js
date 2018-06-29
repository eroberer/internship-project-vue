var userRank = sessionStorage.getItem("rank");
console.log("Rank " + userRank);
var menuItems = [];
switch (userRank) {
  // Öğrenci
  case 1:
    menuItems = [
      {
        name: 'Stajlarım',
        url: '/student/internlist',
        icon: 'icon-speedometer'
      },
    ];
  break;

  default:
    break;
}

export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    },
    {
      title: true,
      name: 'Theme',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: 'Colors',
      url: '/theme/colors',
      icon: 'icon-drop'
    },
    {
      name: 'Typography',
      url: '/theme/typography',
      icon: 'icon-pencil'
    }
  ]
}
