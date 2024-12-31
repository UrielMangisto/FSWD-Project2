let users = JSON.parse(localStorage.getItem("users")) || [
    {
        users: [
        { name: "amir hay", password: 1234 },
        { name: "uriel", password: 1111 }
      ],
    },
  ];


  let online = JSON.parse(localStorage.getItem("online")) || [
    {
        name: "uriel"
    },
  ];

  export default online;