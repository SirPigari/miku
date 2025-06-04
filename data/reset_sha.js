window.onload = () => {
    console.log("Resetting SHA at " + new Date().toISOString());
    localStorage.removeItem("commit_sha");
    alert("Commit SHA has been reset successfully.");
    window.close();
}