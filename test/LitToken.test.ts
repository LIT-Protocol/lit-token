import { expect } from "chai";
import { ethers } from "hardhat";
import { LitToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("LitToken", function () {
  let litToken: LitToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  // Initial supply cap is 1 billion tokens
  const INITIAL_SUPPLY_CAP = ethers.parseEther("1000000000");

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy token
    const LitToken = await ethers.getContractFactory("LitToken");
    litToken = await LitToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await litToken.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await litToken.name()).to.equal("Test Lit");
      expect(await litToken.symbol()).to.equal("tLit");
    });

    it("Should set the correct initial supply cap", async function () {
      expect(await litToken.supplyCap()).to.equal(INITIAL_SUPPLY_CAP);
    });

    it("Should start with zero total supply", async function () {
      expect(await litToken.totalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await litToken.mint(addr1.address, mintAmount);
      expect(await litToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        litToken.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.revertedWithCustomError(litToken, "OwnableUnauthorizedAccount");
    });

    it("Should fail if minting would exceed supply cap", async function () {
      const exceedingAmount = INITIAL_SUPPLY_CAP + BigInt(1);
      await expect(
        litToken.mint(addr1.address, exceedingAmount)
      ).to.be.revertedWith("Supply cap exceeded");
    });

    it("Should allow minting up to supply cap", async function () {
      await litToken.mint(addr1.address, INITIAL_SUPPLY_CAP);
      expect(await litToken.totalSupply()).to.equal(INITIAL_SUPPLY_CAP);
    });
  });

  describe("Supply Cap Management", function () {
    it("Should allow owner to update supply cap", async function () {
      const newCap = INITIAL_SUPPLY_CAP + ethers.parseEther("1000000");
      await litToken.updateSupplyCap(newCap);
      expect(await litToken.supplyCap()).to.equal(newCap);
    });

    it("Should fail if non-owner tries to update supply cap", async function () {
      const newCap = INITIAL_SUPPLY_CAP + ethers.parseEther("1000000");
      await expect(
        litToken.connect(addr1).updateSupplyCap(newCap)
      ).to.be.revertedWithCustomError(litToken, "OwnableUnauthorizedAccount");
    });

    it("Should fail if new supply cap is less than current supply", async function () {
      // First mint some tokens
      const mintAmount = ethers.parseEther("1000000");
      await litToken.mint(addr1.address, mintAmount);

      // Try to set cap below current supply
      const newCap = mintAmount - BigInt(1);
      await expect(litToken.updateSupplyCap(newCap)).to.be.revertedWith(
        "New supply cap must be greater than current supply"
      );
    });
  });

  describe("ERC20 Functionality", function () {
    const mintAmount = ethers.parseEther("1000");

    beforeEach(async function () {
      await litToken.mint(addr1.address, mintAmount);
    });

    it("Should allow transfers between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      await litToken.connect(addr1).transfer(addr2.address, transferAmount);
      expect(await litToken.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await litToken.balanceOf(addr1.address)).to.equal(
        mintAmount - transferAmount
      );
    });

    it("Should allow approvals and transferFrom", async function () {
      const approveAmount = ethers.parseEther("100");
      await litToken.connect(addr1).approve(addr2.address, approveAmount);
      expect(await litToken.allowance(addr1.address, addr2.address)).to.equal(
        approveAmount
      );

      await litToken
        .connect(addr2)
        .transferFrom(addr1.address, addr2.address, approveAmount);
      expect(await litToken.balanceOf(addr2.address)).to.equal(approveAmount);
    });
  });
});
