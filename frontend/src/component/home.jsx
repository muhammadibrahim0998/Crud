import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";

function Home() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'Add', 'Edit', 'View'
  const [selectedEmployee, setSelectedEmployee] = useState({
    id: "",
    name: "",
    email: "",
    job: "",
    salary: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/employees");
    setData(res.data);
  };

  const openModal = (type, employee = null) => {
    setModalType(type);
    if (employee) {
      setSelectedEmployee({ ...employee });
    } else {
      setSelectedEmployee({ id: "", name: "", email: "", job: "", salary: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setSelectedEmployee({
      ...selectedEmployee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (modalType === "Add") {
      await axios.post("http://localhost:5000/employees", {
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        job: selectedEmployee.job,
        salary: parseFloat(selectedEmployee.salary),
      });
    } else if (modalType === "Edit") {
      await axios.put(
        `http://localhost:5000/employees/${selectedEmployee.id}`,
        {
          name: selectedEmployee.name,
          email: selectedEmployee.email,
          job: selectedEmployee.job,
          salary: parseFloat(selectedEmployee.salary),
        }
      );
    }
    fetchEmployees();
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Employees</h2>

      <button className="btn btn-success mb-3" onClick={() => openModal("Add")}>
        Add Employee
      </button>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Job</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.job}</td>
              <td>${item.salary}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => openModal("Edit", item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-secondary me-2"
                  onClick={() => openModal("View", item)}
                >
                  View
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType} Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={selectedEmployee.name}
                onChange={handleChange}
                disabled={modalType === "View"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={selectedEmployee.email}
                onChange={handleChange}
                disabled={modalType === "View"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Job:</Form.Label>
              <Form.Control
                type="text"
                name="job"
                value={selectedEmployee.job}
                onChange={handleChange}
                disabled={modalType === "View"}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Salary:</Form.Label>
              <Form.Control
                type="number"
                name="salary"
                value={selectedEmployee.salary}
                onChange={handleChange}
                disabled={modalType === "View"}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {modalType !== "View" && (
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;
