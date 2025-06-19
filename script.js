const masterStatusList = [
  { short: "Order Placed", full: "Order Placed – Your order has been successfully placed." },
  { short: "Order Confirmed", full: "Order Confirmed – The seller has confirmed the order." },
  { short: "Preparing for Shipment", full: "Preparing for Shipment – The item is being packed." },
  { short: "Label Created", full: "Label Created – Shipping label has been generated." },
  { short: "Awaiting Pickup", full: "Awaiting Pickup – Waiting for the courier to collect the parcel." },
  { short: "Shipment Info Received by Carrier", full: "Shipment Info Received by Carrier – Carrier has received tracking data, not parcel." },
  { short: "Picked Up by Courier", full: "Picked Up by Courier – The parcel is in the hands of the carrier." },
  { short: "Departed from Origin Facility", full: "Departed from Origin Facility – The parcel has left the sender's warehouse." },
  { short: "Arrived at Carrier Facility", full: "Arrived at Carrier Facility – Parcel reached a logistics center." },
  { short: "In Transit to Next Facility", full: "In Transit to Next Facility – Moving to next hub." },
  { short: "Arrived at Sorting Center", full: "Arrived at Sorting Center – At a hub for sorting by destination." },
  { short: "Sorted at Facility", full: "Sorted at Facility – Parcel has been organized and is awaiting departure." },
  { short: "Departed from Sorting Facility", full: "Departed from Sorting Facility – Left the sorting center." },
  { short: "In Transit - Delayed", full: "In Transit - Delayed – En route but facing delays (e.g., traffic, weather)." },
  { short: "Arrived at Destination City", full: "Arrived at Destination City – Arrived near the recipient’s area." },
  { short: "Processing at Delivery Depot", full: "Processing at Delivery Depot – Getting ready for final delivery." },
  { short: "Arrived at Customs", full: "Arrived at Customs – Parcel submitted for customs inspection." },
  { short: "Under Customs Inspection", full: "Under Customs Inspection – Being reviewed by customs officers." },
  { short: "Customs Cleared", full: "Customs Cleared – Approved and released." },
  { short: "Held at Customs", full: "Held at Customs – Needs documentation or payment of duties." },
  { short: "Out for Delivery", full: "Out for Delivery – Courier is delivering it today." },
  { short: "Attempted Delivery – No One Available", full: "Attempted Delivery – No One Available" },
  { short: "Attempted Delivery – Address Issue", full: "Attempted Delivery – Address Issue" },
  { short: "Reattempt Scheduled", full: "Reattempt Scheduled – Will be re-delivered soon." },
  { short: "Delivered to Mailroom/Reception/Neighbor", full: "Delivered to Mailroom/Reception/Neighbor – Not directly to recipient." },
  { short: "Delivered – Signed by Recipient", full: "Delivered – Signed by Recipient – Successfully handed over." },
  { short: "Delivery Exception – Weather/Access Issue", full: "Delivery Exception – Weather/Access Issue" },
  { short: "Return to Sender Initiated", full: "Return to Sender Initiated – Delivery failed; returning to seller." },
  { short: "Parcel Lost in Transit", full: "Parcel Lost in Transit – Officially reported missing." },
  { short: "Returned to Sender", full: "Returned to Sender – Item has reached back to the sender." }
];

const statusTimeOffsets = {
  "Order Placed": 0,
  "Order Confirmed": 0.5,
  "Preparing for Shipment": 1.2,
  "Label Created": 1.8,
  "Awaiting Pickup": 3.5,
  "Shipment Info Received by Carrier": 12.2,
  "Picked Up by Courier": 15.8,
  "Departed from Origin Facility": 22.1,
  "Arrived at Carrier Facility": 28.7,
  "In Transit to Next Facility": 35.5,
  "Arrived at Sorting Center": 42.9,
  "Sorted at Facility": 48.3,
  "Departed from Sorting Facility": 55.6,
  "In Transit - Delayed": 62.9,
  "Arrived at Destination City": 72.4,
  "Processing at Delivery Depot": 81.6,
  "Arrived at Customs": 90.8,
  "Under Customs Inspection": 96.5,
  "Customs Cleared": 103.3,
  "Held at Customs": 108.6,
  "Out for Delivery": 116.9,
  "Attempted Delivery – No One Available": 120.7,
  "Attempted Delivery – Address Issue": 123.5,
  "Reattempt Scheduled": 126.2,
  "Delivered to Mailroom/Reception/Neighbor": 129.8,
  "Delivered – Signed by Recipient": 134.1,
  "Delivery Exception – Weather/Access Issue": 138.7,
  "Return to Sender Initiated": 144.2,
  "Parcel Lost in Transit": 150.0,
  "Returned to Sender": 156.4
};



const openSheetURL = 'https://opensheet.elk.sh/1Q-4yKb-M-HoxAgh96AB9BhAxAj9kxHbRwDjVnshimQ0/Sheet1';

document.getElementById('findBtn').addEventListener('click', findOrder);

async function findOrder() {
  const orderId = document.getElementById('orderIdInput').value.trim();
  const uniqueCode = document.getElementById('uniqueCodeInput').value.trim();
  const outputDiv = document.getElementById('output');

  outputDiv.innerHTML = 'Loading...';

  if (!orderId || !uniqueCode) {
    outputDiv.innerHTML = '<div class="no-result">Please enter both Order ID and Code.</div>';
    return;
  }

  try {
    const response = await fetch(openSheetURL);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();

    const matchedRow = data.find(row =>
      row['Order ID'].toLowerCase() === orderId.toLowerCase() &&
      row['Unique Generated Code'].toLowerCase() === uniqueCode.toLowerCase()
    );

    if (matchedRow) {
      const {
        'Order ID': orderID,
        'Order Date & Time': orderDate,
        'Customer Name': customerName,
        'Shipping address': address,
        'Shipping Type (Economy / Express)': shippingType,
        'Delivery Estimated Date': estimatedDate,
        'Fulfilled Date': fulfilledDate,
        'Current Status': currentStatus,
        'Note to the Customer': customerNote
      } = matchedRow;

      const customerHtml = 
        `<div>
          <div class="guarantee-box">
            <i class="fa-solid fa-shield-halved fa-beat-fade" style="color:#c52233; margin-right: 8px;"></i>
            <strong>Get a $50 Refund</strong> if your delivery is late. Guaranteed by the Estimated Date!
          </div>

          <div class="customer-details">
            <h3>Order ${orderID} — Placed on ${orderDate}</h3>
            <ul>
              <li><strong>Customer Name:</strong> ${customerName}</li>
              <li><strong>Shipping Address:</strong> ${address}</li>
              <li><strong>Fulfilled Date:</strong> ${fulfilledDate || '—'}</li>
              <li><strong>Shipping Type:</strong> ${shippingType || '—'}</li>
              <li><strong>Estimated Delivery:</strong> ${estimatedDate || '<em>Your Order Estimated Delivery Date will be shared soon.</em>'}</li>
            </ul>
          </div>
        </div>`
        ;

const timelineHtml = buildTimeline(currentStatus, orderDate);

      const noteHtml = 
        `<div class="note-box">
          <h3>Note</h3>
          <p>${customerNote || '—'}</p>
        </div>`
      ;

      outputDiv.innerHTML = customerHtml + timelineHtml + noteHtml;
    } else {
      outputDiv.innerHTML = '<div class="no-result">No matching record found.</div>';
    }
  
  } catch (error) {
    outputDiv.innerHTML = `<div class="no-result">Error fetching data: ${error.message}</div>`;
  }
}

function buildTimeline(currentStatus, orderPlacedTime) {
  const currentIndex = masterStatusList.findIndex(status => status.short === currentStatus);
  if (currentIndex === -1) return '';

  const orderDateObj = new Date(orderPlacedTime);

  let timelineHtml = `
    <div class="order-status">
      <h3><i class="fa-solid fa-truck-plane" style="color:#c52233; margin-right: 8px;"></i>Order Status Timeline</h3>
      <ul class="timeline-list">
  `;

  masterStatusList.forEach((status, index) => {
    if (index > currentIndex) return;

    const isCurrent = index === currentIndex;
    const liClass = isCurrent ? 'current' : 'done';
    const iconClass = isCurrent ? 'fa-circle-dot' : 'fa-circle-check';
    const iconColor = isCurrent ? 'orange' : 'green';

    const offsetHours = statusTimeOffsets[status.short] || 0;
    const estimatedDate = new Date(orderDateObj.getTime() + offsetHours * 60 * 60 * 1000);
    const formattedTime = estimatedDate.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    timelineHtml += `
      <li class="${liClass}">
        <div class="timeline-icon"><i class="fa-solid ${iconClass}" style="color:${iconColor};"></i></div>
        <div class="timeline-text">
          <strong>${status.full}</strong><br>
          <small style="color: #aaa;">${formattedTime}</small>
        </div>
      </li>
    `;
  });

  timelineHtml += `
      </ul>
    </div>
  `;

  return timelineHtml;
}



window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const order = params.get('order');
  const code = params.get('code');

  if (order && code) {
    document.getElementById('orderIdInput').value = order;
    document.getElementById('uniqueCodeInput').value = code;
    findOrder(); // auto-run search
  }
});
