import { error } from "console";

type EmployeeData = {
	firstName: string;
	lastName: string;
	email: string;
};

async function fetchEmployees() {
	try {
		const response = await fetch("http://localhost:8080/api/v1/employees");

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error:", error);
        throw error;
	}
}

async function fetchEmployee(id: string) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/employees/${id}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
    }
}

const insertEmployees = async ({firstName, lastName, email} : EmployeeData) => {
	try {
		const response = await fetch("http://localhost:8080/api/v1/employees", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
			}),
		});

        return await response.json();
	} catch (error) {
		console.error(error);
	}
};

const updateEmployee = async (
	employeeId: string,
	{ firstName, lastName, email }: EmployeeData
) => {
	try {
		// Encode the URL parameters
		const params = new URLSearchParams({
			firstName: firstName,
			lastName: lastName,
			email: email,
		});

		const response = await fetch(
			`http://localhost:8080/api/v1/employees/${employeeId}?${params.toString()}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					email: email,
				}),
			}
		);

		return await response.json();
	} catch (error) {
		console.error("Error while updating employee:", error);
		throw error; // Re-throw the error for the caller to handle
	}
};

const deleteEmployee = async (employeeId: string) => {
    try {
        const response = await fetch(
			`http://localhost:8080/api/v1/employees/${employeeId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

        return response.ok;
    } catch (error) {
        console.error("Error while deleting employee:", error);
        throw error;
    }
}

export { fetchEmployees, fetchEmployee, insertEmployees, updateEmployee, deleteEmployee };
