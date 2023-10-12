"use client";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { insertEmployees, fetchEmployees, fetchEmployee, updateEmployee, deleteEmployee } from "@/lib/Employee";
import AddModal from "./AddModal";
import UpdateModal from "./UpdateModal";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Employee = {
	employeeId: string;
	firstName: string;
	lastName: string;
	email: string;
};

export default function EmployeeTable() {
	const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeId, setEmployeeId] = useState<string>("");
    const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
		getEmployees();
	}, []);

	const openModal = (modal: string) => {
		if(modal === "add") {
            setShowAddModal(true);
        } else {         
            setShowUpdateModal(true);
        }
	};

	const closeModal = (modal: string) => {
        if(modal === "add") {
            setShowAddModal(false);
        } else {
            setShowUpdateModal(false);
            setFirstName("");
			setLastName("");
			setEmail("");
        }
	};

    const getEmployees = async () => {
		const data = await fetchEmployees();
		if (data) {
			setEmployees(data);
		}
	};

    async function getEmployee(id: string) {
		try {
			const response = await fetchEmployee(id);
			console.log(response);

			if (response) {
				setFirstName(response.firstName);
				setLastName(response.lastName);
				setEmail(response.email);
			}
		} catch (error) {
			console.error("Error while fetching employee:", error);
		}
	}


	const handleAdd = () => {
		openModal("add");
	};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await insertEmployees({ firstName, lastName, email });
            if(response.message === "Email taken") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Email already taken!",
                })
            } else {
                getEmployees();
				closeModal("add");
            }
		} catch (error) {
			console.log(error);
		}
	};

	const handleEdit = (id: string) => {
        setEmployeeId(id);
        getEmployee(id);
		openModal("update");
	};

    const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await updateEmployee(employeeId, { firstName, lastName, email });
            if(response.message == "Email taken") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Email already taken!",
                })
            } else {
                getEmployees();
				closeModal("update");
            }
        } catch (error) {
            console.log(error);
        }
    };

	const handleDelete = (id: string) => {
        Swal.fire({
        title: 'Delete Confirmation',
        text: 'Are you sure you want to delete this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        confirmButtonColor: '#d33', // Customize the confirm button color
        cancelButtonColor: '#3085d6', // Customize the cancel button color
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEmployee(id);
                    getEmployees();
                } catch (error) {
                    console.log(error);
                }
            }
        });
	};

	return (
		<>
			<AddModal
				isOpen={showAddModal}
				closeModal={closeModal}
				setFirstName={setFirstName}
				setLastName={setLastName}
				setEmail={setEmail}
				handleSubmit={handleSubmit}
			></AddModal>
			<UpdateModal
				isOpen={showUpdateModal}
				closeModal={closeModal}
				setFirstName={setFirstName}
                firstName={firstName}
				setLastName={setLastName}
                lastName={lastName}
				setEmail={setEmail}
                email={email}
				handleSubmitEdit={handleSubmitEdit}
			></UpdateModal>
			<Button onClick={handleAdd}>Add Employee</Button>
			<Table>
				<TableCaption>A list of employees</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">ID</TableHead>
						<TableHead>First Name</TableHead>
						<TableHead>Last Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Edit</TableHead>
						<TableHead>Delete</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{employees.map((employee, index) => (
						<TableRow key={index}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{employee.firstName}</TableCell>
							<TableCell>{employee.lastName}</TableCell>
							<TableCell>{employee.email}</TableCell>
							<TableCell>
								<Button
									variant={"secondary"}
									onClick={() =>
										handleEdit(employee.employeeId)
									}
								>
									Edit
								</Button>
							</TableCell>
							<TableCell>
								<Button
									variant={"destructive"}
									onClick={() =>
										handleDelete(employee.employeeId)
									}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
}
