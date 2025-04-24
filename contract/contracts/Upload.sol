// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Upload {
    
    struct File {
        string url;
        string fileType; // e.g. "image", "pdf", "video", etc.
    }

    struct Access {
        address user;
        bool access; // true or false
    }

    // Mapping from user to their uploaded files
    mapping(address => File[]) public files;

    // Mapping from file URL to the addresses that have access to that file
    mapping(string => mapping(address => bool)) public fileAccess;

    // Mapping to keep track of which users have previously been granted access to which files (for frontend display purposes)
    mapping(address => Access[]) public accessList;
    mapping(address => mapping(address => bool)) public previousData;

    // Upload a file to the contract
    function add(string memory url, string memory fileType) external {
        files[msg.sender].push(File(url, fileType));
    }

    // Share access to a specific file
    function allow(string memory url, address user) public {
        // Ensure that msg.sender owns the file before sharing
        bool found = false;
        for (uint i = 0; i < files[msg.sender].length; i++) {
            if (keccak256(bytes(files[msg.sender][i].url)) == keccak256(bytes(url))) {
                found = true;
                break;
            }
        }
        require(found, "File not found or not owned by sender");

        // Grant access to the file
        fileAccess[url][user] = true;

        // For frontend display purposes (access history)
        if (previousData[msg.sender][user]) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true));
            previousData[msg.sender][user] = true;
        }
    }

    // Remove access to a specific file
    function disallowFileAccess(string memory url, address user) public {
        fileAccess[url][user] = false;

        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    // Display files visible to a user
    function display(address _user) external view returns (File[] memory) {
        // If the user is requesting their own files
        if (_user == msg.sender) {
            return files[_user];
        } else {
            // Return only the files to which msg.sender has access
            uint count = 0;
            for (uint i = 0; i < files[_user].length; i++) {
                if (fileAccess[files[_user][i].url][msg.sender]) {
                    count++;
                }
            }

            File[] memory result = new File[](count);
            uint index = 0;
            for (uint i = 0; i < files[_user].length; i++) {
                if (fileAccess[files[_user][i].url][msg.sender]) {
                    result[index] = files[_user][i];
                    index++;
                }
            }

            return result;
        }
    }

    // View access list for frontend display
    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }
}
