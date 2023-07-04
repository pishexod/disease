import React, {useEffect, useState} from 'react';
import {NavLink, useParams} from "react-router-dom";
import axios from "axios";
import {unitsRoute} from "../api/api";
import {DataGrid} from '@mui/x-data-grid';
import {styled} from "@mui/material";
import {Button} from "@material-ui/core";
import Modal from "react-modal";
import {Input} from "@nextui-org/react";
import {serviceMansRoute} from "../api/api";
import UpdateServiceMan from '../components/UpdateServiceMan';


const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '400px',
        width: '100%',
    },
    form: {
        display: "flex"
    }
};


Modal.setAppElement('#root');
const ManageUnits = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {id} = useParams();
    const [serviceMans, setServiceMans] = useState([]);
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [fullName, setFullName] = useState('');
    const [rank, setRank] = useState('');
    const [position, setPosition] = useState('');
    const [showModalServiceMan, setShowMOdalServiceMan] = useState(false);
    const [serviceMan, setServiceMan] = useState(false);
    const [diseaseModal, isDiseaseModal] = useState(false);
    const getToken = () => {
        const local_token = localStorage.getItem('token');
        if (local_token) return local_token;
    };

    useEffect(() => {
        fetchUnit();
    }, [])

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const fetchUnit = async () => {
        const response = await axios.get(unitsRoute + `/${id}`, {
            headers: {
                Authorization: 'Bearer ' + getToken(),
            }
        });
        setServiceMans(response.data[0].serviceMans);
        setName(response.data[0].name);
        setDescription(response.data[0].description);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log(fullName, position, rank)
        try {
            const response = await axios.post(serviceMansRoute, {
                fullName, position, rank,
                unitId: id
            }, {
                headers: {
                    Authorization: 'Bearer ' + getToken(),
                }
            })
            await fetchUnit();
            setFullName('');
            setRank('');
            setPosition('');
            setIsModalOpen(false)
        } catch (e) {
            console.log(e)
        }

    }

    const columns = [
        {
            field: 'id', headerName: '№', width: 50
        },
        {
            field: 'fullName', headerName: "Повне ім'я", width: 200
        },
        {
            field: 'rank', headerName: "Звання", width: 200
        },
        {
            field: 'position', headerName: 'Посада', width: 200
        }, {
            field: 'action', headerName: 'Дії', width: 200,
            renderCell: (serviceman) => {
                return (
                    <NavLink to={`/manage-serviceman/${serviceman.row.id_service_man}`} style={{
                        fontWeight: 'bold',
                        color: 'blue',
                        textDecoration: 'none',
                    }}
                             activeStyle={{
                                 color: 'blue',
                             }}>Профіль</NavLink>
                )
            }
        }
    ]

    function handleRowDoubleClick(params) {
        const serviceMan = params.row;
        setShowMOdalServiceMan(true)
        setServiceMan(serviceMan);
    }

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleModalClose}
                contentLabel="Додати підрозділ"
                style={modalStyles}
            >
                <div className="modalContent">
                    <h2>Додати підрозділ</h2>
                    <form onSubmit={handleFormSubmit} style={modalStyles}>
                        <div className="select-container">
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                labelPlaceholder={"Введіть повне ім'я в/с"}
                                required={true}
                            />

                        </div>
                        <div className="select-container">
                            <Input
                                value={rank}
                                onChange={(e) => setRank(e.target.value)}
                                labelPlaceholder={"Введіть звання в/с"}
                                required={true}
                            />
                        </div>
                        <div className="select-container">
                            <Input
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                labelPlaceholder={"Введіть посаду в/с"}
                                required={true}
                            />
                        </div>
                        <Button type="submit">Підтвердити</Button>
                    </form>
                </div>
            </Modal>
            <Container>
                <p>Облік в/с {name}</p>
                <DataGrid rows={serviceMans.map((serviceMan, index) => ({
                        id: index + 1,
                        fullName: serviceMan.fullName,
                        rank: serviceMan.rank,
                        position: serviceMan.position,
                        id_service_man: serviceMan.id
                    }
                ))} columns={columns} onRowDoubleClick={handleRowDoubleClick}></DataGrid>

                <Button onClick={() => setIsModalOpen(true)}>
                    Додати в/с
                </Button>
                <a href={'/'}>Повернутися на головну</a>
            </Container>
            {showModalServiceMan && (
                <UpdateServiceMan
                    isOpen={showModalServiceMan}
                    serviceMan={serviceMan}
                    onRequestClose={() => setShowMOdalServiceMan(false)}
                    onUpdateServiceMan={() => fetchUnit()}

                />
            )}
        </>
    );
};
const Container = styled('div')({
    maxWidth: '50vw',
    margin: '0 auto',
    padding: '20px',
});

export default ManageUnits;