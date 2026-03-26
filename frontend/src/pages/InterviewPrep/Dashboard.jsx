import { useEffect, useState } from "react"
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { Plus } from "@phosphor-icons/react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { CARD_BG } from "../../utils/data";
import moment from 'moment';
import SummaryCard from "../../components/Card/SummaryCard";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import toast from "react-hot-toast";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import DashboardSkeleton from "../../components/Loader/DashboardLoader";


export const Dashboard = () => {
    const navigate = useNavigate();

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ open: false, data: null });
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchAllSessions = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
            setSessions(response.data);
        }
        catch (error) {
            console.log("Error fetching sessions", error);
        }
        finally {
            setLoading(false);
        }
    }

    const deleteSession = async (sessionData) => {
        try {
            setLoading(true);
            await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

            toast.success("Session Deleted Successfully");
            setOpenDeleteAlert({
                data: null,
                open: false
            })
            fetchAllSessions();
        }
        catch (error) {
            console.log(`Error: ${error}`)
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        fetchAllSessions();
    }, [])

    return (
        <DashboardLayout>
            <div className={`${loading ? "w-full h-full" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4  justify-items-center"}`}>
                {
                    loading ? <DashboardSkeleton /> :
                        sessions.map((data, index) => {
                            return <SummaryCard
                                key={data?._id}
                                role={data?.role || ""}
                                colors={CARD_BG[index % CARD_BG.length]}
                                topicsToFocus={data?.topicsToFocus || ""}
                                experience={data?.experience || ""}
                                questions={data?.questions || ""}
                                description={data?.description || ""}
                                lastUpdated={data?.updatedAt ? moment(data.updatedAt).format("Do MMM YYYY") : ""}
                                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                                onDelete={() => setOpenDeleteAlert({ open: true, data })}
                            />
                        })}
            </div>
            <div className="flex gap-3  items-center justify-center w-fit text-3xs text-white bg-primary px-10 py-3 rounded-4xl fixed bottom-5 right-5"
                onClick={() => setOpenCreateModal(true)}>
                <Plus size={16} />
                <label>Add new</label>
            </div>
            <Modal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
            >
                <div>
                    <CreateSessionForm />
                </div>
            </Modal>
            <Modal
                open={openDeleteAlert?.open}
                onClose={() => setOpenDeleteAlert({ data: null, open: false })}
                title="Delete Alert"
            >
                <div className="w-[30vw]">
                    <DeleteAlertContent
                        content="Are you sure you want to delete this session ?"
                        onDelete={() => deleteSession(openDeleteAlert.data)}
                    />
                </div>
            </Modal>
        </DashboardLayout>
    )
}
