import React, {useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import {serviceMansRoute, unitsRoute} from "../api/api";


const UpdateServiceMan = ({isOpen, onRequestClose, serviceMan, onUpdateServiceMan}) => {
    const [fullName, setFullName] = useState(serviceMan.fullName);
    const [rank, setRank] = useState(serviceMan.rank);
    const [serviceManId, setServiceManId] = useState(serviceMan.id_service_man);
    const [position, setPosition] = useState(serviceMan.position);

    const getToken = () => {
        const local_token = localStorage.getItem('token');
        if (local_token) return local_token;
    };

    const fetchUpdateServiceMan = async () => {
        const response = await axios.put(serviceMansRoute, {
            id: serviceManId,
            fullName: fullName,
            rank: rank,
            position: position,
        }, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        })
    }

    const fetchDeleteSoldier = async () => {
        const response = await axios.delete(serviceMansRoute, {
            headers: {
                Authorization: 'Bearer ' + getToken(),
            },
            data: {
                id: serviceManId
            }
        })
    }

    const handleDeleteServiceMan = async () => {
        await fetchDeleteSoldier();
        onRequestClose();
        await onUpdateServiceMan();
    }
    const handleUpdateServiceMan = async () => {
        await fetchUpdateServiceMan();
        onRequestClose();
        await onUpdateServiceMan();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Оновити в/с"
            className="modal"
            overlayClassName="modal-overlay"
        >
            <h3>Оновити в/с</h3>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ім'я"/>
            <br/>
            <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Звання в/с"
            />
            <br/>
            <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Посада в/с"
            />
            <br/>
            <button className="btn" onClick={handleUpdateServiceMan}>
                Оновити в/с
            </button>
            <button className="btn" onClick={handleDeleteServiceMan}>
                Видалити в/с
            </button>
            <button className="btn" onClick={onRequestClose}>
                Закрити
            </button>
        </Modal>
    );
};

export default UpdateServiceMan;