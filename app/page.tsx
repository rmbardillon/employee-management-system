import EmployeeTable from "@/components/EmployeeTable";

export default function page() {
	return (
		<main className="container flex flex-col p-12">
			<div className="flex flex-col items-center justify-center">
				<EmployeeTable/>
			</div>
		</main>
	);
}