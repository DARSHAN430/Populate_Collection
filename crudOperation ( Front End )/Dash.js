import { Modal, Button, Popconfirm, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask, updatetask } from './SlicePage';

const Dash = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataa, setDataa] = useState([]);
  const [idUser, setIdUser] = useState("");
  const [userId, setUserId] = useState('');


  const [user_name, setUser_name] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStart_date] = useState("");
  const [end_date, setEnd_date] = useState("");



  const [errors, setErrors] = useState({});
  const [editedUser, setEditedUser] = useState({
    _id: '', // Make sure to include _id for updates
    idUser: '',
    user_name: '',
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    userId: '',
  });

  const [isModOpen, setIsModOpen] = useState(false);


  const history = useNavigate();
  const dispatch = useDispatch();

  const fetchData = () => {
    fetch('http://localhost:3002/crudOpert/PrintTasks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchDropdownData = () => {
    fetch('http://localhost:3002/LSData/PrintNam')
      .then((respons) => {
        if (!respons.ok) {
          throw new Error('Network response was not ok');
        }
        return respons.json();
      })
      .then((dataa) => {
        setDataa(dataa);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    // fetchDropdownData(); // Fetch dropdown data initially
  }, []);

  const addData = () => {
    history('/AddTask');
  };

  const handalEdit = (item) => {
    setIsModOpen(true);
    setEditedUser(item);

  };

  const handleCancel = () => {
    setIsModOpen(false);
  };

  const handleDelete = (itemId) => {
    dispatch(deleteTask(itemId))
      .then(() => {
        setData((prevData) => prevData.filter((item) => item._id !== itemId));
      })
      .catch((error) => {
        message.error('Error deleting task: ' + error.message);
      });

    message.success('DELETED SUCCESS');
  };

  const cancel = (e) => {
    console.log(e);
    message.error('DELETED CANCEL');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let err = {};

    if (editedUser.user_name.trim() === '') {
      err.user_name = 'User Name is REQUIRED';
    }

    if (editedUser.title.trim() === '') {
      err.title = 'Title is REQUIRED';
    }

    if (editedUser.description.trim() === '') {
      err.description = 'Description is REQUIRED';
    }

    if (editedUser.start_date.trim() === '') {
      err.start_date = 'Start Date is REQUIRED';
    }

    if (editedUser.end_date.trim() === '') {
      err.end_date = 'End Date is REQUIRED';
    }
    setErrors(err);

    // if (Object.keys(err).length === 0) {

    //   dispatch(updatetask({ id: editedUser._id, data: editedUser }))
    //     .then(() => {
    //       // After successful update, reload the data
    //       fetchData();
    //       setIsModOpen(false);
    //     })
    //     .catch((error) => {
    //       console.error('Error:', error);
    //     });
    // }


        if (Object.keys(err).length === 0) {
          try {
            // Fetch userId based on selected user_name
            const response = await fetch(`http://localhost:3002/LSData/UserIdByName/${editedUser.user_name}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
      
            if (data && data.userId) {
              // Use the fetched userId in your dispatch
              dispatch(
                updatetask({
                  id: editedUser._id,
                  data: {
                    user_name: editedUser.user_name,
                    title: editedUser.title,
                    description: editedUser.description,
                    start_date: editedUser.start_date,
                    end_date: editedUser.end_date,
                    userId: data.userId, // Use the fetched userId
                  },
                })
              ).then(() => {
                // After successful update, reload the data
                fetchData();
                setIsModOpen(false);
              })
              .catch((error) => {
                console.error('Error:', error);
              });
      
              setUser_name("");
              setTitle("");
              setDescription("");
              setStart_date("");
              setEnd_date("");
              console.log("Form submitted successfully");
              history('/Dash');
            } else {
              throw new Error('UserId not found for selected user_name');
            }
          } catch (error) {
            setError(error.message);
          }
        } else {
          setErrors(err);
        }
  };

  return (
    <>
      <h1>Data Table</h1>
      <button onClick={addData}>Add New Task</button>
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Task Title</th>
            <th>Task Description</th>
            <th>Start Date</th>
            <td />
            <td />
            <th>End Date</th>


          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.user_name}</td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.start_date}</td>
              <td></td>
              <td></td>
              <td>{item.end_date}</td>
              <td></td>
              <td>
                <button onClick={() => handalEdit(item)}>Edit</button>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => handleDelete(item._id)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Delete</Button>
                </Popconfirm>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      <Modal visible={isModOpen} onCancel={handleCancel} footer={null} className="mdl">
        <h2 className="TEXTH2">EDIT DATA</h2>
        <form >
          <label>Select User Name : &nbsp;</label>
          <select
            value={editedUser.user_name || ''}
            onClick={fetchDropdownData} // Uncomment this line
            onChange={(e) => setEditedUser({...editedUser, user_name: e.target.value} )}
          >
            <option value="">Select an option</option>
            {dataa.map((itemNam) => (
              <option key={itemNam._id} value={itemNam.name}>
                {itemNam.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          <label>Task Title : &nbsp;</label>
          <input
            type="text"
            value={editedUser.title}
            onChange={(e) => setEditedUser({...editedUser, title: e.target.value })}
          />
          {errors.title && <div className="er">{errors.title}</div>}
          <br />
          <br />
          <label>Task Description : &nbsp;</label>
          <input
            type="text"
            value={editedUser.description}
            onChange={(e) => setEditedUser({...editedUser, description:e.target.value })}
          />
          {errors.description && <div className="er">{errors.description}</div>}
          <br />
          <br />
          <label>Start Date : &nbsp;</label>
          <input
            type="date"
            value={editedUser.start_date}
            onChange={(e) => setEditedUser({...editedUser, start_date:e.target.value })}
            max={editedUser.end_date || undefined}
          />
          {errors.start_date && <div className="er">{errors.start_date}</div>}
          <br />
          <br />
          <label>End Date : &nbsp;</label>
          <input
            type="date"
            value={editedUser.end_date}
            onChange={(e) => setEditedUser({...editedUser, end_date:e.target.value })}
            min={editedUser.start_date || undefined}
          />
          {errors.end_date && <div className="er">{errors.end_date}</div>}
          <br />
          <br />
          <button type="submit" onClick={handleUpdate}>
            Update Data
          </button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Dash;
