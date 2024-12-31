let users = JSON.parse(localStorage.getItem("users")) || [
    {
        users: [
        { name: "John Doe", password: 1234 },
        { name: "Jane Smith", password: 1111 }
      ],
    },
  ];


  let online = JSON.parse(localStorage.getItem("online")) || [
    {
        online: [
        { name: "John Doe", password: 1234 }
      ],
    },
  ];