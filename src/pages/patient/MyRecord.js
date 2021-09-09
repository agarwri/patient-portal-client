import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../../libs/errorLib";
import AppointmentRecordForm from "../../components/AppointmentRecordForm";

export default function MyRecord() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    function loadRecord() {
      const record = API.get("patient-records", `/patientRecords/${id}`);
      return record;
    }

    async function onLoad() {
      try {
        const record = await loadRecord();

        if (record.attachments) {
          const attachmentURLMap = [];
          for (var i = 0; i < record.attachments.length; i++) {
            var attachment = record.attachments[i];
            var url = await Storage.get(attachment, { level: 'protected', identityId: record.userId });
            attachmentURLMap.push({
              file_name: attachment,
              file_url: url,
            });
          }
          record.attachmentURLs = attachmentURLMap;
        }
        setRecord(record);  
      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
    }

    onLoad();
  }, [id]);

  function saveRecord(record) {
    return API.put("patient-records", `/patientRecords/${id}`, {
      body: record
    }); 
  }

  function deleteRecord() {
    return API.del("patient-records", `/patientRecords/${id}`);
  }


  return (
    <div className="MyRecord">
        {!isLoading && <AppointmentRecordForm saveRecord={saveRecord} deleteRecord={deleteRecord} record={record} />}
    </div>
  );
}
