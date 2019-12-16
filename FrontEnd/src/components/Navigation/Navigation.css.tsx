/* External imports */
import { makeStyles } from '@material-ui/core/styles';

/* Constants */
const drawerWidthOpen = 260;
const drawerWidthClose = 90;
const appbarHeight = 70;

/*
    Styles for the view
*/
export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    navbar: {
        height: appbarHeight,
        position: 'fixed',
        top: 0,
        background: 'white',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 2px 6px -3px',
        zIndex: 1000000000
    },
    navbarOpen: {
        left: drawerWidthOpen,
        width: `calc(100% - ${drawerWidthOpen}px)`,
        transition: theme.transitions.create(['width', 'left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    navbarClose: {
        left: drawerWidthClose,
        width: `calc(100% - ${drawerWidthClose}px)`,
        transition: theme.transitions.create(['width', 'left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    navbarItems: {
        height: '100%',
        width: 'auto',
        marginLeft: theme.spacing(2),
        padding: theme.spacing(0, 3),
        borderRadius: 3,
        fontSize: 16,
        color: theme.palette.grey[600],
        transition: 'all 0.2s ease',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    drawer: {
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        boxShadow:
            '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
        background:
            'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://demos.creative-tim.com/material-dashboard-pro-react/static/media/sidebar-2.d30c9e30.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    drawerHeader: {
        height: appbarHeight,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        fontWeight: 400,
        color: 'white',
        textTransform: 'uppercase',
        transition: 'color 0.2s ease',
        '&:hover': {
            cursor: 'pointer',
            color: theme.palette.primary.main
        }
    },
    listOpen: {
        width: drawerWidthOpen,
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    listClose: {
        width: drawerWidthClose,
        transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    listItem: {
        height: 50,
        width: 'auto',
        margin: theme.spacing(1, 2),
        borderRadius: 3,
        '& .MuiListItemIcon-root': {
            color: 'white'
        },
        '& .MuiListItemText-root': {
            margin: 0,
            '& .MuiListItemText-primary': {
                color: 'white',
                fontSize: 15,
                fontWeight: 300
            }
        },
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
        }
    },
    active: {
        color: 'white',
        backgroundColor: `${theme.palette.primary.main} !important`,
    },
    drawerExtra: {
        position: 'absolute',
        bottom: 10
    },
    drawerExtraBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        '& span': {
            color: 'white'
        }
    },
    drawerExtraBoxClose: {
        flexDirection: 'column'
    },
    bottomButton: {
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        borderRadius: 3,
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
        }
    },
    drawerOpen: {
        width: drawerWidthClose,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        overflowX: 'hidden',
        width: drawerWidthOpen,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    hide: {
        display: 'none'
    },
    content: {
        position: 'absolute',
        marginTop: appbarHeight
    }
}));
