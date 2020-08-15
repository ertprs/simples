$(function () {
    $("#ncms").DataTable({
        "language": {
            "url": "datatables/json/Portuguese-Brasil.json"
        },
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });
    $("#cfops").DataTable({
        "language": {
            "url": "datatables/json/Portuguese-Brasil.json"
        },
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });
});