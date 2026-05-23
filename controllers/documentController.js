const fs = require("fs");
const pdfParse = require("pdf-parse");
const Document = require("../models/Document");
const uploadDocument = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read uploaded PDF
    const buffer = fs.readFileSync(filePath);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);

    // Clean extracted text
    const extractedText = pdfData.text
      .split("\n")
      .filter((item) => item.trim() !== "");

    console.log("Extracted Text:");
    console.log(extractedText);

    // Convert array into single string
    const text = extractedText.join(" ");

    // Extract fields
    const fullName =
      text
        .match(/Name:\s*(.*?)(?=Passport No:|DOB:|Expiry:|$)/i)?.[1]
        ?.trim() || "";

    const documentNumber =
      text.match(/Passport No:\s*(.*?)(?=DOB:|Expiry:|$)/i)?.[1]?.trim() || "";

    const dob =
      text.match(/DOB:\s*(.*?)(?=Expiry:|Nationality:|$)/i)?.[1]?.trim() || "";

    const expiryDate =
      text.match(/Expiry:\s*(.*?)(?=Nationality:|$)/i)?.[1]?.trim() || "";

    const nationality = text.match(/Nationality:\s*(.*)/i)?.[1]?.trim() || "";

    console.log("Extracted Fields:");
    console.log({
      fullName,
      documentNumber,
      dob,
      expiryDate,
      nationality,
    });

    // Find latest existing document
    const oldDocument = await Document.findOne({
      userId: "101",
      documentType: "passport",
      isLatest: true,
    });

    let version = 1;
    let conflict = false;

    const conflictDetails = [];

    // Compare with previous version
    if (oldDocument) {
      version = oldDocument.version + 1;

      if (oldDocument.fullName !== fullName) {
        conflict = true;

        conflictDetails.push({
          field: "fullName",
          oldValue: oldDocument.fullName,
          newValue: fullName,
        });
      }

      if (oldDocument.documentNumber !== documentNumber) {
        conflict = true;

        conflictDetails.push({
          field: "documentNumber",
          oldValue: oldDocument.documentNumber,
          newValue: documentNumber,
        });
      }

      if (oldDocument.expiryDate !== expiryDate) {
        conflict = true;

        conflictDetails.push({
          field: "expiryDate",
          oldValue: oldDocument.expiryDate,
          newValue: expiryDate,
        });
      }

      if (oldDocument.dob !== dob) {
        conflict = true;

        conflictDetails.push({
          field: "dob",
          oldValue: oldDocument.dob,
          newValue: dob,
        });
      }

      if (oldDocument.nationality !== nationality) {
        conflict = true;

        conflictDetails.push({
          field: "nationality",
          oldValue: oldDocument.nationality,
          newValue: nationality,
        });
      }

      // Old document inactive
      oldDocument.isLatest = false;
      await oldDocument.save();
    }

    // Save latest document
    const newDocument = await Document.create({
      userId: "101",
      documentType: "passport",
      fullName,
      documentNumber,
      dob,
      expiryDate,
      nationality,
      extractedText,
      version,
      isLatest: true,
      conflict,
      conflictDetails,
    });

    console.log("Saved Document:");
    console.log({
      id: newDocument._id,
      passport: newDocument.documentNumber,
      version: newDocument.version,
      isLatest: newDocument.isLatest,
      conflict: newDocument.conflict,
      conflictDetails: newDocument.conflictDetails,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      latestDocument: newDocument,
      conflict,
      conflictDetails,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { uploadDocument };
