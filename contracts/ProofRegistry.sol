// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProofRegistry {
    struct AcceptedProof {
        address contributor;
        address reviewer;
        string projectId;
        string packetId;
        bytes32 packetHash;
        string packetUri;
        string payoutRef;
        uint64 acceptedAt;
    }

    mapping(bytes32 => AcceptedProof) public proofs;

    event ProofAccepted(
        bytes32 indexed proofId,
        address indexed contributor,
        address indexed reviewer,
        string projectId,
        string packetId,
        bytes32 packetHash,
        string packetUri,
        string payoutRef
    );

    function recordAcceptedProof(
        address contributor,
        string calldata projectId,
        string calldata packetId,
        bytes32 packetHash,
        string calldata packetUri,
        string calldata payoutRef
    ) external returns (bytes32 proofId) {
        require(contributor != address(0), "Contributor required");
        require(packetHash != bytes32(0), "Packet hash required");

        proofId = keccak256(
            abi.encodePacked(
                block.chainid,
                address(this),
                contributor,
                msg.sender,
                projectId,
                packetId,
                packetHash
            )
        );
        require(proofs[proofId].acceptedAt == 0, "Proof already recorded");

        proofs[proofId] = AcceptedProof({
            contributor: contributor,
            reviewer: msg.sender,
            projectId: projectId,
            packetId: packetId,
            packetHash: packetHash,
            packetUri: packetUri,
            payoutRef: payoutRef,
            acceptedAt: uint64(block.timestamp)
        });

        emit ProofAccepted(
            proofId,
            contributor,
            msg.sender,
            projectId,
            packetId,
            packetHash,
            packetUri,
            payoutRef
        );
    }
}
