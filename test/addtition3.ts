import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Circuit } from "../utils/Circuit";
import { randomField, pointMulBase, BabyJubJubPoint } from "../utils/Circomlib";
import { Addition3Verifier, Addition3Verifier__factory } from "../typechain-types";

describe("Addition3 circuit tests", function () {
	const deployVerifier = async () => {
		const [deployer, relayer] = await ethers.getSigners();
		const Verifier: Addition3Verifier__factory = await ethers.getContractFactory("Addition3Verifier", deployer);
		const verifier: Addition3Verifier = await Verifier.deploy();
		await verifier.deployed();
		// console.log(`Verifier contract deployed to ${verifier.address}`);
		return { verifier, deployer, relayer };
	};

	describe("Verify Offchain", function () {
		it("Should verify the zksnark for correct signals", async function () {
			const Addition3 = new Circuit("Addition3");
			const input = {
				a: 1,
				b: 2,
				c: 3,
			};
			const { proofJson, publicSignals } = await Addition3.generateProof(input);
			// console.log(proofJson);
			let verify;
			verify = await Addition3.verifyProof(proofJson, publicSignals);
			console.log(verify);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect signals", async function () {
			const Addition3 = new Circuit("Addition3");
			const input = {
				a: 1,
				b: 2,
				c: 3,
			};
			const { publicSignals } = await Addition3.generateProof(input);
			console.log(publicSignals);

			const input2 = {
				a: 1,
				b: 1,
				c: 3,
			};
			const { proofJson } = await Addition3.generateProof(input2);

			const verify = await Addition3.verifyProof(proofJson, publicSignals);
			console.log(verify);
			expect(verify).to.be.false;
		});
	});

	describe("Verify Onchain", function () {
		it("Should verify the zksnark for correct signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Addition3 = new Circuit("Addition3");
			const input = {
				a: 1,
				b: 2,
				c: 3,
			};
			const { proofCalldata, publicSignals } = await Addition3.generateProof(input);
			// console.log(proofCalldata)
			let verify;
			verify = await verifier.connect(relayer).verifyProof(proofCalldata, publicSignals);
			console.log(verify);
			expect(verify).to.be.true;
		});

		it("Should not verify zk-snark for incorrect signals", async function () {
			const { verifier, deployer, relayer } = await loadFixture(deployVerifier);
			const Addition3 = new Circuit("Addition3");
			const input = {
				a: 1,
				b: 2,
				c: 3,
			};
			const { publicSignals } = await Addition3.generateProof(input);
			console.log(publicSignals);

			const input2 = {
				a: 1,
				b: 1,
				c: 3,
			};
			const { proofCalldata } = await Addition3.generateProof(input2);
			const verify = await verifier.connect(relayer).verifyProof(proofCalldata, publicSignals);
			console.log(verify);
			expect(verify).to.be.false;
		});
	});
});
