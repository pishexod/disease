import React, {useState} from 'react';
import {useEffect} from 'react';
import {
    Typography,
    CardContent,
    Card,
    CardActions,
    makeStyles,
    Grid, Button
} from '@material-ui/core';
import {Input} from '@nextui-org/react';
import {NavLink, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {checkAuth, unitsRoute} from '../api/api';
import Modal from 'react-modal';

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

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
};
Modal.setAppElement('#root');
const Home = () => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const navigate = useNavigate();
        const [units, setUnits] = useState([]);
        const [unitName, setUnitName] = useState('');
        const [description, setDescription] = useState('');

        useEffect(() => {
            fetchAuth();
            fetchUnits();
        }, []);

        const fetchUnits = async () => {
            try {
                const local_token = getToken();
                const response = await axios.get(unitsRoute, {
                    headers: {
                        Authorization: 'Bearer ' + local_token,
                    },
                });
                setUnits(response.data);
            } catch (e) {
                console.log(e);
            }
        };

        const getToken = () => {
            const local_token = localStorage.getItem('token');
            if (local_token) return local_token;
        };

        const fetchAuth = async () => {
            try {
                const local_token = getToken();
                if (!local_token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(checkAuth, {
                    headers: {
                        Authorization: 'Bearer ' + local_token,
                    },
                });
                if (response.status !== 200) {
                    navigate('/login');
                }
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        };

        const handleFormSubmit = async (event) => {
            event.preventDefault();
            const local_token = localStorage.getItem('token');
            try {
                const response = await axios.post(unitsRoute, {
                    name: unitName,
                    description: description,
                }, {
                    headers: {
                        Authorization: 'Bearer ' + local_token,
                    }
                })
                setUnitName('');
                setDescription('')
                setIsModalOpen(false)
                if (response.status === 201)
                    await fetchUnits();
            } catch (e) {
                console.log(e)
            }
        };
        const handleDeleteUnit = async (id) => {
            console.log(id)
            const local_token = localStorage.getItem('token');
            try {
                await axios.delete(unitsRoute, {
                    headers: {
                        Authorization: 'Bearer ' + local_token,
                    },
                    data: {
                        id: id
                    }
                })
                await fetchUnits();
            } catch (e) {
                console.log(e)
            }
        };


        const handleModalOpen = () => {
            setIsModalOpen(true);
        };

        const handleModalClose = () => {
            setIsModalOpen(false);
        };


        const classes = useStyles();

        return (
            <>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleModalClose}
                    contentLabel="Додати підрозділ"
                    style={modalStyles}
                >
                    <h2>Додати підрозділ</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="select-container">
                            <Input
                                value={unitName}
                                onChange={(e) => setUnitName(e.target.value)}
                                labelPlaceholder={"Введіть ім'я підрозділу"}
                                required={true}
                            />
                        </div>
                        <div className="select-container">
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                labelPlaceholder={"Введіть опис підрозділу"}
                                required={true}
                            />
                        </div>
                        <Button type="submit">Підтвердити</Button>
                    </form>
                </Modal>
                <div>
                    <Button onClick={handleModalOpen}>
                        Додати підрозділ
                    </Button>
                </div>
                <Grid container spacing={3}>
                    {units.map((unit) => (
                        <Grid item key={unit.id} xs={8} sm={4} md={2}>
                            <Card className={classes.root}>
                                <CardContent>
                                    <Typography
                                        className={classes.title}
                                        color="textSecondary"
                                        gutterBottom
                                    >
                                        {unit.name}
                                    </Typography>
                                    <Typography variant="body2" component="p">
                                        {unit.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <NavLink to={`/manage-units/${unit.id}`}   style={{
                                        fontWeight: 'bold',
                                        color: 'blue',
                                        textDecoration: 'none',
                                    }}
                                             activeStyle={{
                                                 color: 'blue',
                                             }}>Керувати підрозділом</NavLink>
                                    <Button onClick={() => handleDeleteUnit(unit.id)}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </>
        )
            ;
    }
;

export default Home;
