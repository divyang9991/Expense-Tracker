import React from 'react'
import Navbar from './Navbar'
import SideBar from './SideBar'
import useGroupStore from '../store/GroupStore.js'
import { useEffect } from 'react'
import GroupList from './GroupList.jsx'
const GroupMember = () => {
  const getGroups=useGroupStore((state)=>state.getGroups);
  const {groups}=useGroupStore();
  useEffect(()=>{
     getGroups();
  },[getGroups]);
  return (
    <>
      <Navbar/>
      <SideBar/>
      <div>
      <div className="relative pl-84 pr-5 pt-24 h-screen bg-gray-100 text-black overflow-hidden">
        <GroupList list={groups}/>
      </div>
      </div>
    </>
  )
}

export default GroupMember
