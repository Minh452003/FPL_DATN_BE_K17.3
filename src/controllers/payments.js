import crypto from 'crypto';
import { request } from 'https';

export const PayMomo = (req, res) => {
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'THANH TOÁN MOMO';
    const partnerCode = 'MOMO';
    const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const ipnUrl = 'http://localhost:8088/api/thanks';
    const requestType = "payWithMethod";
    const amount = req.body.total;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    // Bổ sung
    const userId = req.body.userId;
    const couponId = req.body.couponId;
    const products = req.body.products;
    const status = req.body.status;
    const phone = req.body.phone;
    const address = req.body.address;
    const paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';
    // Create raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // Generate signature
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    // JSON object to send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
        // 
        userId: userId,
        couponId: couponId,
        products: products,
        status: status,
        phone: phone,
        address: address
    });

    // HTTPS request options
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    // Send the request and get the response
    const momoRequest = request(options, momoResponse => {
        console.log(`Status: ${momoResponse.statusCode}`);
        console.log(`Headers: ${JSON.stringify(momoResponse.headers)}`);
        momoResponse.setEncoding('utf8');
        momoResponse.on('data', body => {
            res.json({ payUrl: JSON.parse(body).payUrl });
        });
        momoResponse.on('end', () => {
            console.log('No more data in response.');
        });
    });

    momoRequest.on('error', error => {
        console.log(`Problem with request: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    // Write data to request body
    console.log("Sending....");
    momoRequest.write(requestBody);
    momoRequest.end();
};
