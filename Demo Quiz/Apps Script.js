// ============================================================================
// CONFIG
// ============================================================================
const MAILBLUE_API_URL = 'https://YOUR_ACCOUNT.api-us1.com';
const MAILBLUE_API_KEY = 'YOUR_MAILBLUE_API_KEY';

// ============================================================================
// Draait automatisch na een Google Form inschrijving (Trigger vereist!)
// ============================================================================
function onFormSubmit(e) {
  try {
    if (!e || !e.values) {
      Logger.log("Geen event data gevonden. Test je dit handmatig vanuit de editor?");
      return;
    }

    const values = e.values;
    // Volgorde in Google Sheets: [0] Timestamp, [1] Naam, [2] E-mail, [3] Resultaat, [4] Score
    const name = values[1];
    const email = values[2];
    const result = values[3];
    const score = values[4];

    if (!email) {
      Logger.log("Geen e-mailadres aanwezig in de inzending.");
      return;
    }

    Logger.log("Inzending ontvangen voor: " + email);

    const tags = determineTags(result);
    sendToMailblue(name, email, tags, result, score);

  } catch (error) {
    Logger.log("Fout in onFormSubmit: " + error.toString());
  }
}

// ============================================================================
// Bepaal MailBlue tags
// ============================================================================
function determineTags(result) {
  const tags = ["quiz-boekidee"];

  switch(result) {
    case "Impactmaker":
      tags.push("DEMO-[LEADS]-IMPACTMAKER");
      break;
    case "Strateeg":
      tags.push("DEMO-[LEADS]-STRATEEG");
      break;
    case "StilleKracht":
      tags.push("DEMO-[LEADS]-STILLEKRACHT");
      break;
    default:
      tags.push("quiz-onbekend");
  }
  return tags;
}

// ============================================================================
// Contact aanmaken / bijwerken
// ============================================================================
function sendToMailblue(name, email, tags, result, score) {
  const headers = {
    "Api-Token": MAILBLUE_API_KEY,
    "Content-Type": "application/json"
  };

  // MailBlue verwacht bij velden vaak de 'per_tag' (bijv. %RESULT_TYPE%) of de ID. 
  // We sturen hier zowel de veldnaam mee als fallback.
  const payload = {
    contact: {
      email: email,
      firstName: name,
      fieldValues: [
        {
          field: "result_type", 
          value: result
        },
        {
          field: "quiz_score", 
          value: String(score)
        }
      ]
    }
  };

  const response = UrlFetchApp.fetch(
    MAILBLUE_API_URL + "/api/3/contact/sync",
    {
      method: "post",
      headers: headers,
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
  );

  const responseText = response.getContentText();
  const data = JSON.parse(responseText);

  if (!data.contact) {
    Logger.log("MailBlue Contact sync mislukt: " + responseText);
    return;
  }

  const contactId = data.contact.id;
  Logger.log("Contact succesvol gesynct met ID: " + contactId);

  // Tags toevoegen
  tags.forEach(tag => {
    addTag(contactId, tag, headers);
  });
}

// ============================================================================
// Tag toevoegen aan contact
// ============================================================================
function addTag(contactId, tagName, headers) {
  try {
    // Zoek of de tag al bestaat in MailBlue
    let response = UrlFetchApp.fetch(
      MAILBLUE_API_URL + "/api/3/tags?search=" + encodeURIComponent(tagName),
      { headers: headers, muteHttpExceptions: true }
    );
    
    let data = JSON.parse(response.getContentText());
    let tagId;

    if (data.tags && data.tags.length > 0) {
      tagId = data.tags[0].id;
    } else {
      // Tag bestaat nog niet, maak hem aan
      response = UrlFetchApp.fetch(
        MAILBLUE_API_URL + "/api/3/tags",
        {
          method: "post",
          headers: headers,
          payload: JSON.stringify({
            tag: { tag: tagName, tagType: "contact" }
          }),
          muteHttpExceptions: true
        }
      );
      data = JSON.parse(response.getContentText());
      tagId = data.tag.id;
    }

    // Koppel de tag aan het contact
    UrlFetchApp.fetch(
      MAILBLUE_API_URL + "/api/3/contactTags",
      {
        method: "post",
        headers: headers,
        payload: JSON.stringify({
          contactTag: { contact: contactId, tag: tagId }
        }),
        muteHttpExceptions: true
      }
    );
    Logger.log("Tag '" + tagName + "' succesvol gekoppeld.");
  } catch (e) {
    Logger.log("Fout bij toevoegen van tag '" + tagName + "': " + e.toString());
  }
}