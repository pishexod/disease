import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {serviceMansRoute, diseasesRoute} from '../api/api';
import axios from 'axios';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    makeStyles,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Modal, // Importing Modal from Material-UI
} from '@material-ui/core';
import {Input, useClickAway} from '@nextui-org/react';

const useStyles = makeStyles({
    root: {
        maxWidth: 500,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Setting a high zIndex value for the modal window
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        marginBottom: '10px',
    },
    formControl: {
        width: '100%',
        marginBottom: '10px',
    },
});

const ManageServiceMan = () => {
    const {id} = useParams();
    const [serviceMan, setServiceMan] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [disease, setDisease] = useState([]);
    const [dis, setDis] = useState('');
    const [disc, setDisc] = useState('');
    const [selectedDisease, setSelectedDisease] = useState('');
    const getToken = () => {
        const local_token = localStorage.getItem('token');
        if (local_token) return local_token;
    };

    useEffect(() => {
        fetchServiceMan();
    }, []);

    const fetchServiceMan = async () => {
        const response = await axios.get(serviceMansRoute + `/${id}`, {
            headers: {
                Authorization: 'Bearer ' + getToken(),
            },
        });
        setDisease(response.data[0].disease);
        setServiceMan(response.data[0]);
    };


    const classes = useStyles();

    const handleAddModalOpen = () => {
        setShowAddModal(true);
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
    };

    const handleDeleteModalOpen = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const handleAddDisease = async () => {
        try {
            console.log(dis, disc)
            const response = await axios.post(
                diseasesRoute,
                {
                    name: dis,
                    description: disc,
                    serviceManId:id
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + getToken(),
                    },
                }
            );
            setDisc('');
            setDis('');
            setShowAddModal(false);
            await fetchServiceMan();
        } catch (e) {
            console.log(e);
        }
    };

    const handleDeleteDisease = async () => {
        try {
            const response = await axios.delete(diseasesRoute, {
                data: {id: selectedDisease},
                headers: {
                    Authorization: 'Bearer ' + getToken(),
                },
            });
            setSelectedDisease('');
            setShowDeleteModal(false);
            await fetchServiceMan();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h4" color="textSecondary" gutterBottom>
                        Повне ім'я в/с {serviceMan.fullName}
                    </Typography>
                    <Typography component="p" variant="h5">
                        Звання {serviceMan.rank}
                    </Typography>
                    <Typography variant="h5" component="p">
                        Посада {serviceMan.position}
                    </Typography>
                    <Typography variant={'h5'} component={'p'}>
                        Захворювання
                        {disease.map((dis) => (
                            <Typography variant={'h4'} component={'p'}>
                                {dis.name} - {dis.description}
                            </Typography>
                        ))}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={handleAddModalOpen}>Додати хворобу</Button>
                    <Button onClick={handleDeleteModalOpen}>Видалити хворобу</Button>
                </CardActions>
            </Card>

            <Modal className={classes.modal} open={showAddModal} onClose={handleAddModalClose}>
                <div className={classes.modalContent}>
                    <h2>Додати хворобу</h2>
                    <Input
                        className={classes.input}
                        value={dis}
                        onChange={(e) => setDis(e.target.value)}
                        labelPlaceholder={'Введіть назву хвороби'}
                        required={true}
                    />
                    <Input
                        className={classes.input}
                        value={disc}
                        onChange={(e) => setDisc(e.target.value)}
                        labelPlaceholder={'Введіть опис хвороби'}
                        required={true}
                    />
                    <Button onClick={handleAddDisease}>Додати</Button>
                    <Button onClick={handleAddModalClose}>Закрити</Button>
                </div>
            </Modal>

            <Modal className={classes.modal} open={showDeleteModal} onClose={handleDeleteModalClose}>
                <div className={classes.modalContent}>
                    <h2>Видалити хворобу</h2>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="disease-select-label">Вибрати хворобу</InputLabel>
                        <Select
                            labelId="disease-select-label"
                            id="disease-select"
                            value={selectedDisease}
                            onChange={(e) => setSelectedDisease(e.target.value)}
                        >
                            {disease.map((dis) => (
                                <MenuItem key={dis.id} value={dis.id}>
                                    {dis.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={handleDeleteDisease}>Видалити</Button>
                    <Button onClick={handleDeleteModalClose}>Закрити</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ManageServiceMan;
