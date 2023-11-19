import { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { getDocs, collection, onSnapshot } from 'firebase/firestore';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
    Chip
} from "@nextui-org/react";

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const userId = auth.currentUser.uid;

    useEffect(() => {
        const fetchData = async () => {
            try {
                onSnapshot(collection(db, 'leaderboard'), (querySnapshot) => {
                    const newData = querySnapshot.docs.map((doc) => doc.data());
                    setData(newData.sort((a, b) => b.score - a.score));
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [])


    // classNames={{
    //     base: "max-h-[520px] overflow-x-hidden overflow-y-auto hide",
    //     table: "min-h-[400px]",
    // }}

    // className="max-h-[242px] overflow-x-hidden overflow-y-auto hide rounded-2xl shadow-md"
    return (
        <Table
            isHeaderSticky
            aria-label="Example table with infinite pagination"
            classNames={{
                base: "max-h-[260px] overflow-x-hidden overflow-y-auto hide rounded-2xl shadow-md",
                table: "min-h-[220px]",
            }}
        >
            <TableHeader>
                <TableColumn className="bg-slate-800 text-slate-50" key="position">Position</TableColumn>
                <TableColumn className="bg-slate-600 text-slate-50" key="userName">Username</TableColumn>
                <TableColumn className="bg-slate-600 text-slate-50" key="score">Points</TableColumn>
                <TableColumn className="bg-slate-600 text-slate-50" key="status">Status</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner color="green" />}
            >
                {console.log(data)}
                {
                    data.map((item, index) => (
                        <TableRow key={item.uuid} className={item.uuid === userId ? "bg-zinc-200 sticky top-0" : null}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.userName}</TableCell>
                            <TableCell>{item.highestScore}</TableCell>
                            <TableCell>
                                <Chip color={item.status == "Online" ? "success" : "danger"} variant="dot">{item.status}</Chip>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    );
}

