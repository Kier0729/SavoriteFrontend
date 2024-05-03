import React, { useState, useEffect } from "react";
import axios from "axios"

function TaskManager(){
    axios.defaults.withCredentials = true;
    const [task, setTask] = useState()
    const [newtask, setNewTask] = useState({title:"", status:false});
    const [noInput, setNoInput] = useState(false);
    const API = process.env.REACT_APP_API_URL;
    async function fetch(){
        await axios.get(`${API}/fetch`).then(
            res=>{
                setTask(res.data)
            }
        )
    }
    useEffect(()=>{
        fetch()
    },[]);

    function handleChange(event){
        setNoInput(false)
        event.target.name === "status" && setNewTask({...newtask, status:event.target.value})
        event.target.name === "title" && setNewTask({...newtask, title:event.target.value})
    }
    async function handleSubmit(){
       await axios.post(`${API}/add`, {title:newtask.title, status:newtask.status}).then(
        res=>{
            console.log(res.data)
            fetch()
        }
        )
    }
    async function handleToggle(event){
        await axios.put(`${API}/toggle`, {id:event.target.id, status: event.target.value === "true" ? false : true}).then(
        res=>{
            console.log(res.data)
            fetch()
        }
        )
    }
    async function handelDelete(event){
        const data = {id:event.target.id}
        await axios.delete(`${API}/delete`, {data}).then(
        res=>{
            console.log(res.data)
            fetch()
        }
        )
    }

    return(
        <div className="container">
            <form>
                <label className="font">Title: {<input type="text" name="title" onChange={handleChange} className={noInput ? "noInput" : ""} placeholder={noInput ? "Please fill up this field." : ""}></input>}</label>
                    <div onChange={handleChange}>
                    <label>Status: </label>
                    <label>Complete<input type="radio" value="true" name="status"></input></label>
                    <label>Incomplete<input type="radio" value="false" name="status"></input></label>
                    </div>
                    <button onClick={(event)=>{
                        if(newtask.title){
                            handleSubmit()
                        } else {
                            event.preventDefault();
                            setNoInput(true)
                        } 
                    }}>Submit</button>
            </form>
        <div className="taskOuter">
        {
            task && task.map(items =>{
                return(
                    <div className="taskInner" key={items.id}>
                    <h1>{items.title}</h1>
                    <label className={items.status ? "complete":"incomplete"}>{items.status ? "Complete":"Incomplete"}</label>
                    <button onClick={handleToggle} value={items.status} id={items.id}>Toggle</button>
                    <button onClick={handelDelete} id={items.id}>delete</button>
                    </div>
            )
            })
        }
        </div>
        </div>
    );
}
export default TaskManager;