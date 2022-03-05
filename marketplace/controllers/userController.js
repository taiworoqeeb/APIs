/* eslint-disable prettier/prettier */

const users = [
  {id: 1, name: "raqeeb"},
  {id: 2, name: "taiwo"}
];


exports.getAllUsers = (req, res) => {
    res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
    });
  };
  exports.getUser = (req, res) => {
    const id = req.params.id * 1;

    const user = users.find((el) => el.id === id);
    if (!user) res.status(404).send('The User not found or Not given ID');
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
  });
  };
  exports.createUser = (req, res) => {
    const newId = users[users.length - 1].id + 1;
    const newUser = Object.assign( {id: newId }, req.body );
    
    users.push(newUser);
    res.send(users);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  };

  exports.updateUser = (req, res) => {
    const id = req.params.id * 1;
    const user = users.find((el) => el.id === id);
    if (!user) res.status(404).send('The User not found or Not given ID');
    user.name =req.body.name;
    res.send(user);

    res.status(200).json({
      status: "success",
      data: {
        id,
        users,
      },
    });
  };

  exports.deleteUser = (req, res) => {
    const id = req.params.id * 1;
    const user = users.find((el) => el.id === id);
    if (!user) res.status(404).send('The User not found or Not given ID');
    const index = users.indexOf(user);
    users.splice(index, 1)
    res.send(user);
  };