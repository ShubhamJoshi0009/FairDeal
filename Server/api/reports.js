

const express = require('express');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const router = express.Router();

// Helper function to get the month name
const getMonthName = (month) => new Date(0, month - 1).toLocaleString('default', { month: 'long' });

router.get('/monthly-report', async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }

        const monthInt = parseInt(month, 10);
        const yearInt = parseInt(year, 10);

        if (isNaN(monthInt) || isNaN(yearInt) || monthInt < 1 || monthInt > 12) {
            return res.status(400).json({ error: 'Invalid month or year' });
        }

        const startDate = new Date(yearInt, monthInt - 1, 1);
        const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59);

        console.log('Start Date:', startDate, 'End Date:', endDate);

        const bookings = await Booking.find({
            booking_start_date: { $gte: startDate, $lte: endDate }
        });
        console.log('Bookings:', bookings);

        const payments = await Payment.find({
            date_of_payment: { $gte: startDate, $lte: endDate },
            payment_status: 'success'
        });
        console.log('Payments:', payments);

        const totalListings = bookings.length;
        const activeListings = bookings.filter((b) => b.booking_status === 'pending').length;
        const soldListings = bookings.filter((b) => b.booking_status === 'completed').length;
        const rentedListings = bookings.filter((b) => b.booking_status === 'confirmed').length;
        const requestedListings = bookings.filter((b) => b.booking_status === 'canceled').length;

        const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

        const reportData = {
            month: getMonthName(monthInt),
            year: yearInt,
            totalListings,
            activeListings,
            soldListings,
            rentedListings,
            requestedListings,
            totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
            generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };

        res.status(200).json(reportData);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});


module.exports = router;
