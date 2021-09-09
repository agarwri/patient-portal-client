import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../../libs/errorLib";
import AppointmentRecordForm from "../../components/AppointmentRecordForm";
import { configureScope } from "@sentry/browser";

export default function Notes() {
  
  const { userPoolUserId, id } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadRecord() {
      const record = API.get("patient-records", `/patients/records/${userPoolUserId}/${id}`);
      return record;
    }

    async function generateAttachmentUrlMap(fileNames, isDoctor, userId) {
      const attachmentURLMap = [];
      for (var i = 0; i < fileNames.length; i++) {
        console.log("loop");
        var fileName = fileNames[i];
        var url = isDoctor ?  await Storage.vault.get(fileName) : await Storage.get(fileName, { level: 'protected', identityId: userId });
        attachmentURLMap.push({
          file_name: fileName,
          file_url: url,
        });
      }
      return attachmentURLMap;
    }

    async function onLoad() {
      try {
        const record = await loadRecord();

        if (record.attachments) {
          console.log(record.attachments);
          record.attachmentURLs = await generateAttachmentUrlMap(record.attachments, false, record.userId);
          console.log(record.attachmentURLs);
        }
        if (record.doctor_attachments) {
          record.doctorAttachmentURLs = await generateAttachmentUrlMap(record.doctor_attachments, true, record.userId);
        }
        setRecord(record);  
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }
    
    onLoad();
  }, [id, userPoolUserId]);

 
  function saveRecord(record) {
    return API.put("patient-records", `/patients/records/${userPoolUserId}/${id}`, {
      body: record
    });
  }

  
  function deleteRecord() {
    return API.del("patient-records", `/patients/records/${userPoolUserId}/${id}`);
  }

  function uploadFiles() {

  }
 
  return (
    <div className="RecordForPatient">
        {!isLoading && (
          <AppointmentRecordForm saveRecord={saveRecord} deleteRecord={deleteRecord} record={record} />
        )}
    </div>
  );
}
