/* External imports */
import React, { useEffect, useState, useCallback } from 'react';
import { Typography, CssBaseline, List, ListItem, ListItemText, ListItemIcon, Grid, IconButton } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

/* Libraries */
import clsx from 'clsx';

/* Local imports */
import { useStyles } from './Navigation.css';
import SidebarItems from './DrawerItems';
import Copyright from './Copyright';
import PersonalSettingsView from '../Views/PersonalSettingsView/PersonalSettingsView';

import { getFarms } from '../../utils/Controllers/FarmController';
import { Farm } from '../../common/Farm';
import { logout, isFavorite, getUserId } from '../../utils/Controllers/UserController';
import { getCookie, setCookie } from '../../utils/Cookies';

/*
    Renders the general layout; drawer, navbar, and current view component
*/
const Navigation = () => {
    const classes = useStyles(); // Import css file

    /*
        drawerState: contains the state that handles the position of the drawer
        tabIndex: contains the state that handles the index of the top tabs of the navbar
        drawerIndex: contains the state that handles the index of the items of the left drawer
        favList: contains the state that handles the list of favorite farms
        drawerItems: contains the state that handles the drawer items from @file{DrawerItems}
        view: contains the state that handles the current view component
        forceUpdate: updates the component wherein it is put
    */ const [
        collapseSidebarState,
        setCollapse
    ] = React.useState(false); // Collapse state of the sidebar
    const [tabIndex, setTabIndex] = React.useState(0); // Index of the tabs at the top
    const [sidebarIndex, setSidebarIndex] = React.useState(0); // Index of the sidebaritems
    const [favList, setFavs] = React.useState(Array<Farm>()); // The favoriteList with farms
    const [sidebarItems, setSidebarItems] = React.useState(Array<any>()); // The sidebarItems
    const [view, setView] = React.useState(); // The current subview to show
    const forceUpdate = useForceUpdate(); // Forceupdate the view

    /*
        fetchData(): fetchData gets all data that are stored in the database and returns them
    */
    async function fetchData() {
        var farms = new Array(0);
        try {
            farms = await getFarms(); // Get all farms
        } catch {}

        /* Create the favorite farm list */
        var favoriteList = new Array<any>();
        farms.forEach(element => {
            // Add to favorite list if farm is a favorite farm
            if (isFavorite(element.id)) {
                favoriteList.push(element);
            }
        });
        setFavs(favoriteList); // Set the favorite list

        /* Determine selected farm to show (tabIndex) */
        var selectedFarmId;
        if (favoriteList.length > 0) {
            // If favorite list is not empty
            let tabIndexCookie = getCookie('tabIndex', getUserId()); // Get the tabIndex from cookies
            if (tabIndexCookie) {
                // Tabindex retrieved from cookies
                if (Number(tabIndexCookie) >= favoriteList.length) {
                    // If Tabindex is higher than the available favorite farms
                    selectedFarmId = favoriteList[tabIndex].id; // Pick default tabIndex
                } else {
                    // Set tabIndex to tabindex from cookies
                    selectedFarmId = favoriteList[Number(tabIndexCookie)].id;
                    setTabIndex(Number(tabIndexCookie));
                }
            } else {
                // No tabIndex in cookies
                selectedFarmId = favoriteList[tabIndex].id; // Pick default tabIndex
            }
        } else {
            // Favorite list is empty
            selectedFarmId = -1;
        }

        /* Get sidebaritems from farm */
        let tempSidebarItems = await SidebarItems(selectedFarmId);
        setSidebarItems(tempSidebarItems);

        /* Determine selected view in sidebar */
        let tempSidebarIndex = getCookie('drawerIndex', getUserId()); // get the sidebarIndex from cookies
        if (tempSidebarIndex) {
            // SidebarIndex retrieved from cookies
            if (Number(tempSidebarIndex) >= tempSidebarItems.length) {
                // If sidebarIndex is higher than the available sidebaritems
                if (sidebarIndex >= tempSidebarItems.length) {
                    // If sidebarIndex is higher than the available sidebaritems
                    // Set default index and update view and update cookies
                    setView(tempSidebarItems[0].path);
                    setSidebarIndex(0);
                    setCookie('drawerIndex', '0', getUserId());
                } else {
                    // Set sidebar Index to the new sideBarIndex
                    setView(tempSidebarItems[sidebarIndex].path);
                    setCookie(
                        'drawerIndex',
                        sidebarIndex.toString(),
                        getUserId()
                    );
                }
            } else {
                // Set sidebar Index to the sidebarIndex from cookies, and update view
                setSidebarIndex(Number(tempSidebarIndex));
                setView(tempSidebarItems[Number(tempSidebarIndex)].path);
            }
        } else {
            // No sidebarIndex in cookies, set default index
            setView(tempSidebarItems[sidebarIndex].path);
        }
    }

    /*
        useEffect(): useEffect refreshes the render after a state has been updated
    */
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabIndex]);

    /*
        handleDrawer(): handles the state of the sidebar
    */
    function handleDrawer() {
        setCollapse(!collapseSidebarState);
    }

    /*
        useForceUpdate(): forcefully updates the view to rerender
    */
    function useForceUpdate() {
        const [, setTick] = useState(0);
        const update = useCallback(() => {
            setTick((tick: number) => tick + 1);
        }, []);
        return update;
    }

    /*
        header(): handles the state of the header text
    */
    function header() {
        if (collapseSidebarState) {
            // Normal header
            return (
                <Typography
                    className={classes.drawerHeader}
                    onClick={handleDrawer}
                >
                    stripefarmer
                </Typography>
            );
        } else {
            // Collapsed header
            return (
                <Typography
                    className={classes.drawerHeader}
                    onClick={handleDrawer}
                >
                    SF
                </Typography>
            );
        }
    }

    /*
        Returns the drawer, navbar, and current view component
    */
    return (
        <div className={classes.root}>
            <CssBaseline />
            <List
                className={clsx(classes.navbar, {
                    [classes.navbarOpen]: collapseSidebarState,
                    [classes.navbarClose]: !collapseSidebarState
                })}
            >
                {/* Render the tabs on the top */
                favList.map(({ name }, index) => (
                    <ListItem
                        className={classes.navbarItems}
                        classes={{ selected: classes.active }}
                        button
                        key={index}
                        selected={tabIndex === index}
                        onClick={() => {
                            setTabIndex(index);
                            setCookie(
                                'tabIndex',
                                index.toString(),
                                getUserId()
                            );
                            forceUpdate();
                        }}
                    >
                        <ListItemText primary={name} />
                    </ListItem>
                ))}
            </List>

            <div
                className={clsx(classes.drawer, {
                    [classes.drawerClose]: collapseSidebarState,
                    [classes.drawerOpen]: !collapseSidebarState
                })}
            >
                {header()}
                <List
                    className={clsx({
                        [classes.listOpen]: collapseSidebarState,
                        [classes.listClose]: !collapseSidebarState
                    })}
                >
                    {/* Render the sidebarItems */
                    sidebarItems.map(({ title, icon, path }, index) => (
                        <ListItem
                            className={classes.listItem}
                            classes={{ selected: classes.active }}
                            button
                            key={index}
                            selected={sidebarIndex === index}
                            onClick={() => {
                                setView({ path }.path);
                                setSidebarIndex(index);
                                setCookie(
                                    'drawerIndex',
                                    index.toString(),
                                    getUserId()
                                );
                                forceUpdate();
                            }}
                        >
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                                primary={title}
                                className={clsx({
                                    [classes.hide]: !collapseSidebarState
                                })}
                            />
                        </ListItem>
                    ))}
                </List>
                <Grid
                    container
                    className={clsx(classes.drawerExtra, {
                        [classes.drawerClose]: collapseSidebarState,
                        [classes.drawerOpen]: !collapseSidebarState
                    })}
                >
                    <Grid
                        item
                        className={clsx(classes.drawerExtraBox, {
                            [classes.drawerExtraBoxClose]: !collapseSidebarState
                        })}
                        xs={12}
                    >
                        <IconButton
                            className={classes.bottomButton}
                            onClick={() => setView(<PersonalSettingsView />)}
                        >
                            <SettingsIcon />
                        </IconButton>
                        <IconButton
                            className={classes.bottomButton}
                            onClick={logout}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    </Grid>
                    <Grid
                        item
                        className={clsx({
                            [classes.hide]: !collapseSidebarState
                        })}
                        xs={12}
                    >
                        <Copyright />
                    </Grid>
                </Grid>
            </div>
            <div
                className={clsx(classes.content, {
                    [classes.navbarOpen]: collapseSidebarState,
                    [classes.navbarClose]: !collapseSidebarState
                })}
            >
                {<React.Fragment>{view}</React.Fragment>}
            </div>
        </div>
    );
};

export default Navigation;
