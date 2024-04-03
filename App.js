import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [open1, setIsOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [select, isSelected] = useState(null);

  const displayName = () => {
    if (select) {
      return friends.find((el) => el.id === select).name;
    } else {
      return "X";
    }
  };
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          open={open2}
          setOpen={setOpen2}
          selectItem={isSelected}
          currSelected={select}
          friends={friends}
        ></FriendList>
        {open1 && (
          <AddFormFriend
            onclick={setIsOpen1}
            newFriends={setFriends}
          ></AddFormFriend>
        )}
        <button onClick={() => setIsOpen1((c) => !c)} className="button">
          {open1 ? "Return" : "AddFriend"}
        </button>
      </div>
      {open2 && (
        <FormSplitBill
          setFriends={setFriends}
          name={displayName()}
        ></FormSplitBill>
      )}
    </div>
  );
}

function FriendList({ friends, selectItem, currSelected, open, setOpen }) {
  return (
    <>
      <ul>
        {friends.map((el) => (
          <Friend
            open={open}
            setOpen={setOpen}
            selectItem={selectItem}
            currSelected={currSelected}
            friend={el}
            key={el.id}
          ></Friend>
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, selectItem, currSelected, open, setOpen }) {
  const displayColor = () => {
    if (friend.balance > 0) {
      return "green";
    } else if (friend.balance < 0) {
      return "red";
    } else {
      return "";
    }
  };
  const setItem = () => {
    selectItem(friend.id);
    if (currOpen) setOpen((c) => !c);
    else setOpen(true);
  };

  const currOpen = currSelected === friend.id && open;

  return (
    <li className={currOpen ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      <p className={displayColor()}>
        {friend.balance > 0
          ? `${friend.name} owes you ${friend.balance}€`
          : `You owe ${friend.name} ${Math.abs(friend.balance)}€`}
      </p>
      <button onClick={setItem} className="button">
        {currOpen ? "Close" : "Select"}
      </button>
    </li>
  );
}

function AddFormFriend({ newFriends, onclick }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !img) return;
    const id = crypto.randomUUID();

    const newFriend = {
      id: id,
      name: name,
      image: `${img}?=${id}`,
      balance: 0,
    };

    onclick((o) => !o);

    newFriends((friends) => [...friends, newFriend]);

    setImg("https://i.pravatar.cc/48");
    setName("");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
      <label>Image URL</label>
      <input value={img} onChange={(e) => setImg(e.target.value)} type="text" />
      <button className="button">Add Friend</button>
    </form>
  );
}

function FormSplitBill({ name, setFriends }) {
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [whoPays, setWhoPays] = useState("you");

  const finalValue = value1 - value2;

  const billAlert = (e) => {
    if (!value1) return alert("Please enter the Bill first");

    setValue2(e.target.value > Number(value1) ? value2 : e.target.value);
  };

  const addBalance = (e) => {
    e.preventDefault();

    if (!value1 || !value2) return;
    if (whoPays === "you") {
      setFriends((friend) =>
        friend.map((el) =>
          el.name === name ? { ...el, balance: el.balance + finalValue } : el
        )
      );
    }
    if (whoPays === "friend") {
      setFriends((friend) =>
        friend.map((el) =>
          el.name === name
            ? { ...el, balance: el.balance - Number(value2) }
            : el
        )
      );
    }
  };

  return (
    <form onSubmit={addBalance} className="form-split-bill">
      <h2>Split a Bill with {name}</h2>

      <label>Bill Value</label>
      <input
        value={value1}
        onChange={(e) => setValue1(e.target.value)}
        type="text"
      ></input>
      <label>Your Expense</label>
      <input value={value2} onChange={billAlert} type="text" />
      <label>{name}'s expenses</label>
      <input value={finalValue} type="text" disabled />
      <label>Who is Paying the Bill?</label>
      <select onChange={(e) => setWhoPays(e.target.value)}>
        <option value="you">You</option>
        <option value="friend">{name}</option>
      </select>
      <button className="button">Split Bill</button>
    </form>
  );
}

export default App;
