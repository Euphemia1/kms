import { useEffect, useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({ name: "", role: "" });

  useEffect(() => {
    async function fetchTeam() {
      const response = await fetch("/api/team");
      const data = await response.json();
      setTeamMembers(data);
    }

    fetchTeam();
  }, []);

  const handleAddMember = async () => {
    const response = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    });

    if (response.ok) {
      const updatedTeam = await response.json();
      setTeamMembers(updatedTeam);
      setNewMember({ name: "", role: "" });
    }
  };

  const handleDeleteMember = async (id: number) => {
    const response = await fetch(`/api/team/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const updatedTeam = await response.json();
      setTeamMembers(updatedTeam);
    }
  };

  return (
    <div>
      <h1>Manage Team</h1>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
        />
        <button onClick={handleAddMember}>Add Member</button>
      </div>
      <ul>
        {teamMembers.map((member) => (
          <li key={member.id}>
            {member.name} - {member.role}
            <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}