import React, { useEffect, useState } from "react";
import { AddData } from "./SlicePage";
import { useDispatch, useSelector } from "react-redux";
import Dash from "./Dash";
import { useNavigate } from "react-router-dom";

function AddTask() {

    const [user_name, setUser_name] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [start_date, setStart_date] = useState("");
    const [end_date, setEnd_date] = useState("");
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [dataa, setDataa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    

    const dispatch = useDispatch();

    const history = useNavigate();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};

        if (user_name === "") {
            validationErrors.user_name = "Select User Name is required";
        }

        if (title.trim() === "") {
            validationErrors.title = "Task Title is required";
        }

        if (description.trim() === "") {
            validationErrors.description = "Task Description is required";
        }

        if (start_date.trim() === "") {
            validationErrors.start_date = "Task Start Date is required";
        }

        if (end_date.trim() === "") {
            validationErrors.end_date = "Task End Date is required";
        }

        // if (Object.keys(validationErrors).length === 0) {

        //     // const selectedOptionData = dataa.find((itemNam) => itemNam.name === user_name);

        //     // // Check if a matching option was found
        //     // if (selectedOptionData) {
        //     //     const selectedUserId = selectedOptionData._id;
        //     //     setUserId(selectedUserId);
        //     // }
        //     dispatch(AddData({ user_name, title, description, start_date, end_date })).then(() => {
        //         history('/Dash');
        //     })


        //     setUser_name("");
        //     setTitle("");
        //     setDescription("");
        //     setStart_date("");
        //     setEnd_date("");
        //     console.log("Form submitted successfully");

        // } else {

        //     setErrors(validationErrors);
        // }
        
        if (Object.keys(validationErrors).length === 0) {
            try {
              // Fetch userId based on selected user_name
              const response = await fetch(`http://localhost:3002/LSData/UserIdByName/${user_name}`);
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              const data = await response.json();
        
              if (data && data.userId) {
                // Use the fetched userId in your dispatch
                dispatch(
                  AddData({
                    user_name,
                    title,
                    description,
                    start_date,
                    end_date,
                    userId: data.userId, // Use the fetched userId
                  })
                );
        
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
            setErrors(validationErrors);
          }
    };

    const handalcal = () => {
        history('/Dash');
    }

    return (
        <div>
            <h1>ADD NEW TASK</h1>
            <form className="table" onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td>Select User Name :</td>
                            <td>
                                <select
                                    value={user_name} onClick={fetchDropdownData}
                                    onChange={(e) => setUser_name(e.target.value)}>
                                    <option value="">Select an option</option>
                                    {dataa.map((itemNam) => (
                                        <option key={itemNam._id} value={itemNam.name}>
                                            {itemNam.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                        {errors.user_name && (
                            <tr>
                                <td></td>
                                <td style={{ color: "red" }}>{errors.user_name}</td>
                            </tr>
                        )}<br />

                        <tr>
                            <td>Task Title:</td>
                            <td>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </td>
                        </tr>
                        {errors.title && (
                            <tr>
                                <td></td>
                                <td style={{ color: "red" }}>{errors.title}</td>
                            </tr>
                        )}<br />

                        <tr>
                            <td>Task Description:</td>
                            <td>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </td>
                        </tr>
                        {errors.description && (
                            <tr>
                                <td></td>
                                <td style={{ color: "red" }}>{errors.description}</td>
                            </tr>
                        )}<br />

                        <tr>
                            <td>Task Start_date:</td>
                            <td>
                                <input
                                    style={{ width: '100%' }}
                                    type="date"
                                    value={start_date}
                                    onChange={(e) => setStart_date(e.target.value)}
                                    max={end_date || undefined}
                                />
                            </td>
                        </tr>
                        {errors.start_date && (
                            <tr>
                                <td></td>
                                <td style={{ color: "red" }}>{errors.start_date}</td>
                            </tr>
                        )}<br />
                        <tr>
                            <td>Task End_date:</td>
                            <td >
                                <input
                                    style={{ width: '100%' }}
                                    type="date"
                                    value={end_date}
                                    onChange={(e) => setEnd_date(e.target.value)}
                                    min={start_date || undefined}
                                />
                            </td>
                        </tr>
                        {errors.end_date && (
                            <tr>
                                <td></td>
                                <td style={{ color: "red" }}>{errors.end_date}</td>
                            </tr>
                        )}<br />
                    </tbody>
                </table>

                <button type="submit">Submit</button>
                <button type="" onClick={handalcal}>Cancel</button>
            </form>
        </div>
    );
}

export default AddTask;


// mi ikadun kela hota pan to receive zala nasel 