import Order from "../models/orders.js"
import { orderSchema } from "../schemas/order.js";
import Coupon from "../models/coupons.js"
import Product from "../models/products.js";
const { createHmac } = await import('node:crypto');
import { request } from 'https';

export const getOrderByUserId = async (req, res) => {
    try {
        const id = req.params.userId
        const order = await Order.find({ userId: id }).populate('products.productId status');
        return res.status(200).json({
            message: "Lấy thông tin người dùng đặt hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const id = req.params.id
        const order = await Order.findById(id).populate('products.productId status')
        if (!order || order.length === 0) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Lấy 1 đơn hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getAllOrder = async (req, res) => {
    try {
        const order = await Order.find().populate('products.productId status');
        if (!order) {
            return res.status(404).json({
                error: "Lấy tất cả đơn hàng thất bại"
            })
        }
        return res.status(200).json({
            message: "Lấy tất cả đơn hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const removeOrder = async (req, res) => {
    try {
        // Tìm đơn hàng để lấy thông tin sản phẩm đã mua
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            });
        }
        // Lặp qua từng sản phẩm trong đơn hàng và cập nhật lại số lượng sản phẩm và view
        for (const item of order.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Tăng số lượng sản phẩm lên theo số lượng đã hủy
                product.stock_quantity += item.stock_quantity;
                // Giảm số lượng đã bán (view) đi theo số lượng đã hủy
                product.sold_quantity -= item.stock_quantity;
                await product.save();
            }
        }
        await Order.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Xóa đơn hàng thành công!",
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        if (body.total > 5000000) {
            const accessKey = 'F8BBA842ECF85';
            const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            const orderInfo = 'CỌC ĐƠN HÀNG MOMO';
            const partnerCode = 'MOMO';
            const redirectUrl = 'http://localhost:8088/api/momo-deposit';
            const ipnUrl = 'http://localhost:8088/api/momo-deposit';
            const requestType = "payWithMethod";
            const amount = req.body.total * 0.2;
            const orderId = partnerCode + new Date().getTime();
            const requestId = orderId;
            // Bổ sung
            const total = req.body.total - amount;
            const userId = req.body.userId;
            const couponId = req.body.couponId;
            const products = req.body.products;
            const status = req.body.status;
            const phone = req.body.phone;
            const address = req.body.address;
            const extraData = `total=${total}&userId=${userId}&couponId=${couponId}&phone=${phone}&address=${address}&products=${JSON.stringify(products)}`;
            const orderGroupId = '';
            const autoCapture = true;
            const lang = 'vi';
            // Create raw signature
            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
            // Generate signature
            const signature = createHmac('sha256', secretKey)
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
                total: total,
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
                },
            };

            // Send the request and get the response
            const momoRequest = request(options, momoResponse => {
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
        } else {
            // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
            if (body.couponId !== null) {
                // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
                const coupon = await Coupon.findById(body.couponId);
                if (coupon) {
                    if (coupon.coupon_quantity > 0) {
                        coupon.coupon_quantity -= 1;
                        await coupon.save();
                    } else {
                        return res.status(400).json({ message: 'Phiếu giảm giá đã hết lượt sử dụng' });
                    }
                }
            }

            // Lặp qua từng sản phẩm trong đơn hàng và cập nhật số lượng và số lượng sản phẩm đã bán
            for (const item of body.products) {
                const product = await Product.findById(item.productId);
                if (product) {
                    // Giảm số lượng sản phẩm tương ứng với số lượng mua
                    product.stock_quantity -= item.stock_quantity; // Giảm số lượng theo số lượng trong giỏ hàng
                    // Tăng số lượng đã bán (view) tương ứng với số lượng mua
                    product.sold_quantity += item.stock_quantity; // Tăng view theo số lượng trong giỏ hàng
                    await product.save();
                }
            }

            const order = await Order.create(body);
            if (!order) {
                return res.status(404).json({
                    error: "Đặt hàng thất bại"
                })
            }

            return res.status(200).json({
                message: "Đặt hàng thành công",
                order
            });
        }


    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}



export const updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const order = await Order.findByIdAndUpdate(id, body, { new: true }).populate('products.productId status')
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật đơn hàng thành công",
            orderUpdateSuccess: order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}